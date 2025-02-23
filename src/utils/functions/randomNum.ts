
function random() {
const num1 = Math.floor(Math.random() * 10) + 1;
const num2 = Math.floor(Math.random() * 10) + 1;
const Key = ["+", "-", "*"];
const randomKey = Key[Math.floor(Key.length * Math.random())];
return { num1, num2, randomKey }
};

export default random;