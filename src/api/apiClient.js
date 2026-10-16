const API_BASE_URL =
  "https://fbk7tgys17.execute-api.ap-south-1.amazonaws.com/dev";


// =========================
// FETCH PACKAGES
// =========================
export const fetchPackages = async () => {

  try {

    const response = await fetch(`${API_BASE_URL}/packages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch packages");
    }

    const data = await response.json();

    console.log("PACKAGES RESPONSE:", data);

    return data;

  } catch (error) {

    console.error("Error fetching packages:", error);

    return [];
  }
};


// =========================
// CREATE BOOKING
// =========================
export const createBooking = async (bookingData) => {

  try {

    const response = await fetch(`${API_BASE_URL}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to create booking");
    }

    const data = await response.json();

    console.log("BOOKING RESPONSE:", data);

    return data;

  } catch (error) {

    console.error("Error creating booking:", error);

    throw error;
  }
};


// =========================
// PROCESS PAYMENT
// =========================
export const processPayment = async (paymentData) => {

  try {

    const response = await fetch(`${API_BASE_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Failed to process payment");
    }

    const data = await response.json();

    console.log("PAYMENT RESPONSE:", data);

    return data;

  } catch (error) {

    console.error("Error processing payment:", error);

    throw error;
  }
};


// =========================
// CHAT WITH BEDROCK
// =========================
export const chatWithBedrock = async (message, sessionId = null) => {

  try {

    const response = await fetch(
      "https://fbk7tgys17.execute-api.ap-south-1.amazonaws.com/dev/chatbot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify(
        sessionId
          ? { 
              userMessage: message,
              sessionId,
              agentId: "ADJPRBYJPX",
              agentAliasId: "TSTALIASID"
            }
          : { 
              userMessage: message,
              agentId: "ADJPRBYJPX",
              agentAliasId: "TSTALIASID"
            }
      ),
      }
    );

    const data = await response.json();

    console.log("CHATBOT RAW RESPONSE:", data);

    return data;

  } catch (error) {

    console.error("Chatbot API Error:", error);

    return {
      reply: "⚠️ Chatbot server error. Please try again."
    };
  }
};