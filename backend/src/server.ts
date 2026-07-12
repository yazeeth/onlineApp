import app from "./app";

console.log("Starting server file...");

const PORT = 5050;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log("After listen command...");