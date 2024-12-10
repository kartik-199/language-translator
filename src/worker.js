import {pipeline} from '@huggingface/transformers';
class TranslatorPipeline{
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M';
    static instance = null;
    static async getInstance(){
        if(this.instance === null){
            this.instance = await pipeline(this.task, this.model);
        }
        return this.instance;
    }
}