import { useStores } from "../models/store";

interface Media {
  id?: number;
  origin_url?: string;
  original_url?: string;
  file?:File;
  mime_type?:string
}

interface Options {
  files: FileList;
  callBackLocal?: (medias: Media[]) => void;
  callBackApi?: (medias: Media[]) => void;
}

export function usePostMedia() {
  const { mediaModel } = useStores()
  const handlePostMedia = async (options: Options) => {
    if (options.files.length === 0) return;
    let medias: Media[] = []
    for (var i = 0; i < options.files.length; i++) {
      const link = URL.createObjectURL(options.files[i])
      const item: Media = {
        id: undefined,
        origin_url: link,
        original_url: link,
        file:options.files[i],
        mime_type:options.files[i].type
      }
      medias.push(item)
    }
    if (options.callBackLocal) options.callBackLocal(medias);
    if (options.callBackApi) {
      medias = [];
      for (var j = 0; j < options.files.length; j++) {
        let formData = new FormData();
        formData.append('file', options.files[j]);
        const response = await mediaModel.postMedia(formData);
        const item: Media = {
          id: response.id,
          origin_url: response.original_url,
          original_url: response.original_url
        }
        medias.push(item);
        options.callBackApi(medias);
      }
    }
    return medias;
  }
  return {
    handlePostMedia
  }
}