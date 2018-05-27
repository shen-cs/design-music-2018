class Portion{
    constructor(inta,intb,intc){
        var sum=inta+intb+intc;
        if(sum==0)
            sum=1;
        this.partial1=inta/sum;
        this.partial2=intb/sum;
        this.partial3=intc/sum;
    }
    minus(portion){
        var a=this.partial1-portion.partial1;
        var b=this.partial2-portion.partial2;
        var c=this.partial3-portion.partial3;
        return [a,b,c];
    }
}
// each audio should be longer than the presenting time
// constants time-between;alter-times;
// transformations{Portion-difference --> volume change interval}
const altertimes=100;
const timebetween=5000;
class Audios{
    //path a b c=>path of audio file
    constructor(patha,pathb,pathc){
        this.audio1=new Audio(patha);
        this.audio2=new Audio(pathb);
        this.audio3=new Audio(pathc);
        this.timetransform = this.timetransform.bind(this);
        this.setmultiple = this.setmultiple.bind(this);
        this.setindividual = this.setindividual.bind(this);
        this.stop = this.stop.bind(this);
    }
    //portion difference --> change time interval 
    timetransform(difference){
        var addtime=timebetween*difference*difference/altertimes;
        return addtime;
    }
    //track = audio diff = portion difference of the track
    setindividual(track,diff){
        var i=0;
        var timevar=setInterval(()=>{
            if(i>=altertimes){
                clearInterval(timevar);
            }
            else{
                console.log(i);
                track.volume=track.volume+diff/altertimes;
                i++;
            }
        },this.timetransform(diff))
    }
    //transformations of portion change 
    setmultiple(portionnow,portionnext){
        var diffportion=portionnext.minus(portionnow);
        console.log(diffportion);
        this.setindividual(this.audio1,diffportion[0]);
        this.setindividual(this.audio2,diffportion[1]);
        this.setindividual(this.audio3,diffportion[2]);
    }
    stop(){
        this.audio1.pause();
        this.audio2.pause();
        this.audio3.pause();
    }
    //input array of portions
    play(portionarray){
        this.audio1.volume=portionarray[0].partial1;
        this.audio2.volume=portionarray[0].partial2
        this.audio3.volume=portionarray[0].partial3;
        this.audio1.play();
        this.audio2.play();
        this.audio3.play();
        var i=0;
        var alltimevar=setInterval(() => {
            if(i>=portionarray.length-1){
                stop();
                clearInterval(alltimevar);
            }
            else{
                console.log(i);
                i++;   
                this.setmultiple(portionarray[i-1],portionarray[i]);
            }
        },timebetween)
    }
}
path1="Symphony.mp3";
path2="淡水Water.mp3";
path3="淡水hype.mp3";
audios=new Audios(path1,path2,path3);
portion1=new Portion(2,5,10);
portion2=new Portion(0,0,0);
portion3=new Portion(2,5,10);
portionarray=[portion1,portion2,portion3];