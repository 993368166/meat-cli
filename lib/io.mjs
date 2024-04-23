import fs from 'fs';
import path from "path";
import decompress from "decompress";

export const deletePath = filePath => {
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    files.forEach((file) => {
      const currentPath = path.join(filePath, file);
      if (fs.statSync(currentPath).isDirectory()) {
        deletePath(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    })
    fs.rmdirSync(filePath);
  }
}

export const unzipFile = (file, destPath, callBack) => {
  decompress(file, destPath, {
    map: file => {
      file.path = file.path.substr(file.path.indexOf('/') + 1)
      return file
    }
  })
    .then(files => {
      callBack()
    })
    .catch(error => {
      callBack(error)
    });
}