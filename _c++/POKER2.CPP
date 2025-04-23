#define TRUE 1;
#define FALSE 0;




void IniziaGrafica()
{

	/* request auto detection */
	int gdriver=DETECT;
	int gmode, errorcode;
	/* initialize graphics mode */
	initgraph(&gdriver, &gmode,"");
	/* read result of initialization */
	errorcode = graphresult();
	if (errorcode != grOk)  /* an error occurred */
	{
		printf("Graphics error: %s\n", grapherrormsg(errorcode));
		printf("Press any key to halt:");
		getch();
		exit(1); /* terminate with an error code */
	}
}


void finestra(int x,int y,int larg,int lung,int colore,char *titolo){
 int s;
 settextstyle(0,0,0);
 setcolor(LIGHTGRAY);
 setfillstyle(1,LIGHTGRAY);
 bar3d(x,y,x+larg,y+lung,0,0);

 setcolor(WHITE);
 line(x,y,x+larg,y);
 line(x,y,x,y+lung);
 setcolor(BLACK);
 line(x,y+lung,x+larg,y+lung);
 line(x+larg,y,x+larg,y+lung);


 setcolor(LIGHTBLUE);
 setfillstyle(1,BLUE);
 bar3d(x+2,y+2,x+larg-3,y+25,0,0);
 setcolor(BLUE);
 line(x+2,y+25,x+larg-3,y+25);
 line(x+larg-3,y+2,x+larg-3,y+25);


 setcolor(YELLOW);
 s=x+(larg/2)-(textwidth(titolo)/2);
 outtextxy(s,y+10,titolo);
}

void blackscreen (){
 setfillstyle(1,BLACK);
 bar(0,0,640,480);
}

void pulsante(int sel,int x,int y,int larg, int lung,char testo[]){


if (sel)  {
	 setfillstyle(1,BLUE);
	 setcolor(BLACK);
	 bar3d(x,y,x+larg,y+lung,0,0);
	 setcolor(WHITE);
	 line(x,y+lung,x+larg,y+lung);
	 line(x+larg,y,x+larg,y+lung);
	 settextstyle(0,0,0);
	 setcolor(WHITE);
	 outtextxy(x+(larg/2)-(textwidth(testo)/2),
	  y+(lung/2)-(textheight(testo)/2),testo);

	 }
else {
	 setfillstyle(1,LIGHTGRAY);
	 setcolor(WHITE);
	 bar3d(x,y,x+larg,y+lung,0,0);
	 setcolor(BLACK);
	 line(x,y+lung,x+larg,y+lung);
	 line(x+larg,y,x+larg,y+lung);
	 settextstyle(0,0,0);
	 outtextxy(x+(larg/2)-(textwidth(testo)/2),
	  y+(lung/2)-(textheight(testo)/2),testo);

	  }


}

char *edit(int x, int y, int num_carat,int SoloNum,char *titolo){
static char testo[100];
char c;
int i,larg,lung;
void *temp;
struct textsettingstype ttinfo;

gettextsettings(&ttinfo);
settextstyle(ttinfo.font,ttinfo.direction,ttinfo.charsize);

lung=textheight("L")+20;
if ((num_carat*textwidth("M")+20)>(textwidth(titolo)+20))
larg=num_carat*textwidth("M")+20;
else larg=textwidth(titolo)+20;
temp=malloc(imagesize(x,y,x+larg+20,y+lung+47));
getimage(x,y,x+larg+20,y+lung+47,temp);
finestra(x,y,larg+20,lung+47,0,titolo);

settextstyle(ttinfo.font,ttinfo.direction,ttinfo.charsize);
x=x+10;
y=y+37;

	//ora x,y sono do iniza ledit in alto a sinistra
setfillstyle(1,WHITE);
setcolor(BLACK);
bar3d(x,y,x+larg,y+lung,0,0);
setcolor(BLACK);
line(x+3,y+lung-3,x+3+10,y+lung-3);
setcolor(LIGHTGRAY);
line(x,y+lung,x+larg,y+lung);
line(x+larg,y,x+larg,y+lung);
i=0;
testo[0]=0;
do {

	if (SoloNum) do c=getch();
		 while (
	( ((c<48)|(c>57)) &&((c!=13)&&(c!=27)&&(c!=8))  )
	|(c==NULL)&&(getch()!=0) //per non leggere F1,F2,...
	) ;
	 else
		do
		 c=getch();
		while ((c==NULL)&&(getch()!=0)); //per non leggere F1,F2,...

 if ((c!=13)&&(c!=27)){
	setcolor(WHITE);
	outtextxy(x+3,y+(lung/2)-(textheight("L")/2),testo);
	line(x+3+textwidth(testo),y+lung-3,x+3+10+textwidth(testo),y+lung-3);
	setcolor(BLACK);
	if ((c==8)&&(i>=0)) {
	 i--;
	 testo[i]=0;
	 }
	  else
		 if (i<num_carat) {
		 testo[i]=c;
		 i++;
		 testo[i]=0;
		 }
	outtextxy(x+3,y+(lung/2)-(textheight("L")/2),testo);
	if (i<0) i=0;
	line(x+3+textwidth(testo),y+lung-3,x+3+10+textwidth(testo),y+lung-3);
	}

} while ((c!=13)&&(c!=27));



putimage(x-10,y-37,temp,0);
free(temp);

if (c==27)    return NULL;
return testo;
}


int menu(int x,int y,int larg,int lung,char titolo[],char *puls[]){
void *temp;
char ch;
int i,j,l,ritorna;
int k[30];
int numpul;
	// legge il num di pulsanti
for (numpul=1; puls[numpul][0]; numpul++);


for(i=0;i<numpul;i++) {
	 if (i==0) k[i]=1;
	 else k[i]=0;
		 }
temp=malloc(imagesize(x,y,x+larg,y+lung));
getimage(x,y,x+larg,y+lung,temp);
finestra(x,y,larg,lung,0,titolo);
if (numpul==0) for(;getch()!=13;);
else {
  // stampa allinizio tutti i pulsanti;
  l=(lung-30-(5*numpul))/numpul;
  for (i=1;i<=numpul;i++)
	  pulsante(k[i-1],x+5,30+y+((l+5)*(i-1)),larg-10,l,puls[i-1]);

do {

ch=getch() ;
	switch (ch){
	  case NULL :
		switch(ch=getch())  {
		 case 72:
		 for(j=0;j<numpul;j++)
		 if ((k[j]==1)&&(j!=0)) {
			 k[j-1]=1; k[j]=0; break;
			 }
		 break;
		 case 80:
		  for(j=0;j<numpul;j++)
		 if ((k[j]==1)&&(j!=numpul-1)) {
			 k[j+1]=1; k[j]=0; break;
			 }
		  break; }
		};

 for (i=1;i<=numpul;i++)
	  if (k[i-1]==1) {
	if ((ch==72)) {
		  pulsante(k[i-1],x+5,30+y+((l+5)*(i-1)),larg-10,l,puls[i-1]);
		  pulsante(k[i],x+5,30+y+((l+5)*(i)),larg-10,l,puls[i]);
		  }
	  if ((ch==80)) {
		  pulsante(k[i-1],x+5,30+y+((l+5)*(i-1)),larg-10,l,puls[i-1]);
		  pulsante(k[i-2],x+5,30+y+((l+5)*(i-2)),larg-10,l,puls[i-2]);
		  }
	ritorna=i;

	}
} while ((ch!=13)&&(ch!=27));
		}

putimage(x,y,temp,0);
free(temp);
if (ch==27) return -1;
return ritorna;
}