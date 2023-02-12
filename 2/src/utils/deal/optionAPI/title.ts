import {getTextStyle} from '@/utils/deal/optionAPI/common'
 
export function getTitle(dataName: string) {
    return {
        show: true,
        text: dataName,
        
        x:'center',
        y:'top',

        textStyle: getTextStyle(),
    }
}
