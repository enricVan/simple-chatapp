<script setup>
import { onBeforeMount, ref } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const messages = ref([]);
const messageText = ref("");
const joined = ref(false);
const name = ref("");
const typingDisplay = ref("");

onBeforeMount(() => {
  socket.emit("findAllMessages", {}, (res) => {
    messages.value = res;
  });

  socket.on("message", (message) => {
    messages.value.push(message);
  });

  socket.on("typing", ({ name, isTyping }) => {
    if (isTyping) {
      typingDisplay.value = `${name} is typing...`;
    } else {
      typingDisplay.value = "";
    }
  });
});

const join = () => {
  socket.emit("join", { name: name.value }, (res) => {
    joined.value = true;
  });
};

const sendMessage = (message) => {
  socket.emit("createMessage", { text: messageText.value }, (res) => {
    // messages.value.push(res);
    messageText.value = "";
  });
};

let timeout;
const emitTyping = () => {
  socket.emit("typing", { isTyping: true, name: name.value });

  timeout = setTimeout(() => {
    socket.emit("typing", { isTyping: false, name: name.value });
  }, 1000);
};
</script>

<template>
  <div class="chat">
    <div v-if="!joined">
      <form @submit.prevent="join">
        <label>What's your name?</label> <br />
        <input v-model="name" />
        <button type="submit">Join</button>
      </form>
    </div>
    <div class="chat-container" v-else>
      <div class="messages-container">
        <div v-for="message in messages">
          [{{ message.name }}]: {{ message.text }}
        </div>
      </div>

      <div v-if="typingDisplay">{{ typingDisplay }}</div>
      <hr />
      <br />
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>👉</label>
          <input v-model="messageText" @input="emitTyping" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
@import "./assets/base.css";
.chat {
  padding: 20px;
  height: 89vh;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  overflow: hidden;
}
</style>
