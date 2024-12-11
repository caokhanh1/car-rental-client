import { useState } from "react";

const styles = {
  widget: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  button: {
    width: "60px",
    height: "60px",
    backgroundColor: "#FFC107",
    color: "white",
    fontSize: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  chatBox: {
    width: "600px",
    height: "550px",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    bottom: "0",
    right: "80px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    padding: "10px",
    backgroundColor: "rgb(228 188 97)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  content: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    fontSize: "14px",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    fontSize: "14px",
  },
  sendButton: {
    marginLeft: "10px",
    padding: "8px 16px",
    backgroundColor: "rgb(228 188 97)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const input = document.getElementById("message-input");
    const chatContent = document.getElementById("chat-content");
  
    if (input.value.trim() !== "") {
      const userMessageBox = document.createElement("div");
      userMessageBox.style.display = "flex";
      userMessageBox.style.justifyContent = "flex-end";
      userMessageBox.style.marginBottom = "10px";
  
      const userMessageBubble = document.createElement("div");
      userMessageBubble.textContent = input.value;
      userMessageBubble.style.maxWidth = "60%";
      userMessageBubble.style.padding = "10px 15px";
      userMessageBubble.style.backgroundColor = "rgb(220 196 127)";
      userMessageBubble.style.color = "#fff";
      userMessageBubble.style.borderRadius = "20px";
      userMessageBubble.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      userMessageBubble.style.fontSize = "14px";
      userMessageBubble.style.wordWrap = "break-word";
      userMessageBubble.style.textAlign = "right";
  
      userMessageBox.appendChild(userMessageBubble);
      chatContent.appendChild(userMessageBox);
  
      const userInput = input.value;
      input.value = "";
  
      try {
        const response = await fetch("https://car-rental-123.runasp.net/api/dialogflow/detect-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userInput }),
        });
  
        if (!response.ok) {
          throw new Error("Error in API request");
        }
  
        const data = await response.json();
  
        const botMessageBox = document.createElement("div");
        botMessageBox.style.display = "flex";
        botMessageBox.style.justifyContent = "flex-start";
        botMessageBox.style.marginBottom = "10px";
  
        const botMessageBubble = document.createElement("div");
        botMessageBubble.textContent = data.responseMessage; 
        botMessageBubble.style.maxWidth = "60%";
        botMessageBubble.style.padding = "10px 15px";
        botMessageBubble.style.backgroundColor = "#f1f1f1";
        botMessageBubble.style.color = "#333";
        botMessageBubble.style.borderRadius = "20px";
        botMessageBubble.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        botMessageBubble.style.fontSize = "14px";
        botMessageBubble.style.wordWrap = "break-word";
        botMessageBubble.style.textAlign = "left";
  
        botMessageBox.appendChild(botMessageBubble);
        chatContent.appendChild(botMessageBox);
      } catch (error) {
        console.error("Error sending message:", error);
      }
  
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={styles.widget}>
      <div style={styles.button} onClick={toggleChat}>
        💬
      </div>
      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            <span>Hỗ trợ trực tuyến</span>
            <button
              onClick={toggleChat}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
          <div id="chat-content" style={styles.content}>
            {/* <p>Chào bạn! Hãy bắt đầu chat với chúng tôi.</p> */}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              id="message-input"
              placeholder="Nhập tin nhắn..."
              style={styles.input}
              onKeyDown={handleKeyDown} 
            />
            <button onClick={sendMessage} style={styles.sendButton}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
