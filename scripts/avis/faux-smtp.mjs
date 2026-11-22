// Faux serveur SMTP local pour les essais : accepte tout, écrit chaque message dans OUT/n.eml.
//   node scripts/avis/faux-smtp.mjs 2525 <dossier>
import net from "node:net";
import fs from "node:fs";
const [PORT = "2525", OUT = "."] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
net.createServer(sock => {
  let data = false, buf = "", corps = "";
  const dire = l => sock.write(l + "\r\n");
  dire("220 faux-smtp");
  sock.on("data", chunk => {
    buf += chunk.toString("latin1");
    let i;
    while ((i = buf.indexOf("\r\n")) >= 0) {
      const ligne = buf.slice(0, i); buf = buf.slice(i + 2);
      if (data) {
        if (ligne === ".") { data = false; fs.writeFileSync(`${OUT}/${++n}.eml`, corps, "latin1"); corps = ""; dire("250 OK"); }
        else corps += ligne + "\r\n";
        continue;
      }
      const cmd = ligne.slice(0, 4).toUpperCase();
      if (cmd === "EHLO") sock.write("250-faux-smtp\r\n250-AUTH PLAIN LOGIN\r\n250 OK\r\n");
      else if (cmd === "AUTH") dire("235 OK");
      else if (cmd === "DATA") { data = true; dire("354 go"); }
      else if (cmd === "QUIT") { dire("221 bye"); sock.end(); }
      else dire("250 OK");
    }
  });
}).listen(Number(PORT), "127.0.0.1", () => console.log("faux SMTP sur", PORT));
