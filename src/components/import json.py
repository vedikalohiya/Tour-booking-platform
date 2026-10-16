import json
import urllib.request
import boto3
from datetime import datetime
import re

dynamodb = boto3.resource('dynamodb')
trips_table = dynamodb.Table('GT_TourTrips')

API_BASE_URL = "https://fbk7tgys17.execute-api.ap-south-1.amazonaws.com/dev"

def lambda_handler(event, context):

    print("EVENT:", json.dumps(event))

    function_name = event.get("function")

    try:

        # =========================
        # GET PACKAGES
        # =========================
        if function_name == "getPackages":

            try:
                # Fetch packages from DynamoDB TourPackages table directly
                packages_table = dynamodb.Table('TourPackages')
                response = packages_table.scan()
                packages = response.get('Items', [])

                print("PACKAGES FROM DYNAMODB:", packages)

                if not packages:
                    message = "No packages available in the database."
                else:
                    message = "Available Packages:\n\n"
                    for pkg in packages:
                        message += f"📍 {pkg.get('Name', 'N/A')}\n"
                        message += f"💰 ₹{pkg.get('Price', 'N/A')}\n"
                        message += f"🆔 Package ID: {pkg.get('PackageID', 'N/A')}\n"
                        if pkg.get('Description'):
                            message += f"📝 {pkg.get('Description')}\n"
                        message += "\n"

            except Exception as e:
                print("GET PACKAGES ERROR:", str(e))
                message = "Unable to fetch packages from database right now."

        # =========================
        # CREATE BOOKING
        # =========================
        elif function_name == "createBooking":

            param_list = event.get("parameters") or []
            params = {p["name"]: p["value"] for p in param_list if "name" in p}

            name = params.get("Name")
            contact = params.get("Contact")
            package_name = params.get("Package")
            people = params.get("People")
            user_date = params.get("TripDate")

            if not all([name, contact, package_name, people, user_date]):
                return build_response(function_name, "Missing booking details. Please provide: Name, Contact, Package, Number of people, and Trip Date.")

            formatted_date = datetime.strptime(user_date, "%Y-%m-%d").strftime("%d-%b-%Y").upper()

            # Fetch package details from DynamoDB TourPackages table
            packages_table = dynamodb.Table('TourPackages')
            package_response = packages_table.scan()
            package_found = None

            for pkg in package_response.get('Items', []):
                if pkg.get('Name', '').lower() == package_name.lower():
                    package_found = pkg
                    break

            if not package_found:
                return build_response(function_name, f"Package '{package_name}' not found in database. Please check available packages.")

            package_id = package_found.get('PackageID')
            price_str = package_found.get('Price', '0').replace('₹', '').replace(',', '').strip()
            price_per_person = int(float(price_str)) if price_str else 0

            numbers = re.findall(r'\d+', people)
            adults = int(numbers[0]) if len(numbers) > 0 else 0
            children = int(numbers[1]) if len(numbers) > 1 else 0
            total_people = adults + children

            response = trips_table.scan()
            trip_found = None

            for item in response.get("Items", []):
                if (
                    str(item.get("Date")).strip().upper() == formatted_date and
                    str(item.get("PackageID")).strip() == package_id
                ):
                    trip_found = item
                    break

            if not trip_found:
                return build_response(function_name, f"No trip available for {package_name} on {formatted_date}")

            if int(trip_found.get("Seats", 0)) < total_people:
                return build_response(function_name, "Not enough seats available")

            total_price = price_per_person * total_people

            payload = {
                "packageId": package_id,
                "packageName": package_name,
                "name": name,
                "contact": contact,
                "email": "test@gmail.com",
                "adults": adults,
                "children": children,
                "totalPrice": total_price
            }

            print("PAYLOAD:", payload)

            booking_id = "N/A"

            try:
                req = urllib.request.Request(
                    f"{API_BASE_URL}/booking",
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )

                with urllib.request.urlopen(req) as res:
                    response_body = res.read().decode()
                    print("API RESPONSE:", response_body)

                    api_response = json.loads(response_body)

                    if "body" in api_response:
                        body = json.loads(api_response["body"])
                    else:
                        body = api_response

                    booking_id = body.get("bookingId", "N/A")

            except Exception as api_error:
                print("API ERROR:", str(api_error))
                return build_response(function_name, "Booking service failed. Please try again.")

            new_seats = int(trip_found["Seats"]) - total_people

            trips_table.update_item(
                Key={
                    "PackageID": trip_found["PackageID"],
                    "TripID": trip_found["TripID"]
                },
                UpdateExpression="SET Seats = :s",
                ExpressionAttributeValues={
                    ":s": new_seats
                }
            )

            message = (
                f"Booking successful ✅\n"
                f"Name: {name}\n"
                f"Package: {package_name}\n"
                f"Adults: {adults}, Children: {children}\n"
                f"Total Price: ₹{total_price}\n"
                f"Booking ID: {booking_id}\n"
                f"Remaining Seats: {new_seats}"
            )

        else:
            message = "Invalid function request"

        return build_response(function_name, message)

    except Exception as e:
        print("ERROR:", str(e))
        return build_response(function_name, f"Error: {str(e)}")


# =========================
# RESPONSE BUILDER
# =========================
def build_response(function_name, message):
    return {
        "response": {
            "actionGroup": function_name,
            "function": function_name,
            "functionResponse": {
                "responseBody": {
                    "TEXT": {
                        "body": message
                    }
                }
            }
        }
    }