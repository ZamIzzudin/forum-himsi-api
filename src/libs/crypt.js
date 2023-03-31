import bcrypt from "bcrypt";

async function encrpyt_one_way(data) {
    const salt = await bcrypt.genSalt();
    const encrypted = await bcrypt.hash(data, salt);

    return encrypted
}

async function pairing_one_way(raw, encrypted) {
    const is_same = await bcrypt.compare(raw, encrypted);

    return is_same
}

export { encrpyt_one_way, pairing_one_way }