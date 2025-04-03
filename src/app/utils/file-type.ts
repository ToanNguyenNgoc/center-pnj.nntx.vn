export const regexFileType = {
  image: /^image\/(png|jpg|jpeg|gif|webp|bmp|svg)$/i,
  video: /^video\/(mp4|webm|mov|avi|wmv|flv|mkv|3gp)$/i,
  pdf: /^application\/pdf$/i,
  word: /^application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/i,
  youtube:/^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(?:[^/]+\/)?watch\?v=[\w-]+$/i
}

type FileType = 'IMAGE' | 'VIDEO' | 'PDF' | 'WORD' | 'FILE'
export const acceptMedia={
  imageVideo:'image/*, video/*'
}
export const getFileType = (fileType?: string): FileType => {
  let type:FileType = 'FILE';
  if (!fileType) return type;
  if (regexFileType.image.test(fileType)) return type = 'IMAGE';
  if (regexFileType.video.test(fileType)) return type = 'VIDEO';
  if (regexFileType.pdf.test(fileType)) return type = 'PDF';
  if (regexFileType.word.test(fileType)) return type = 'WORD';
  return type;
}