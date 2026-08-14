import multer from "multer";
import path from "path";
import crypto from "crypto";

// Define o caminho absoluto até a pasta 'uploads' na raiz da aplicação
const tmpFolder = path.resolve(process.cwd(), "uploads");

export default {
  directory: tmpFolder,

  // Configura a estratégia de armazenamento em disco
  storage: multer.diskStorage({
    destination: tmpFolder,

    filename(request, file, callback) {
      // Gera 10 bytes aleatórios em formato Hexadecimal (ex: 4f8b21a9c3)
      const fileHash = crypto.randomBytes(10).toString("hex");

      // Substitui espaços por underscores e combina com o hash
      const fileName = `${fileHash}-${file.originalname.replace(/\s+/g, "_")}`;

      // Retorna o novo nome final do arquivo
      return callback(null, fileName);
    },
  }),
};
