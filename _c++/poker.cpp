#include <graphics.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <conio.h>
#include <dos.h>
#include <alloc.h>
#include <ctype.h>
#include "poker2.cpp"

#define COP "By Xray82 (xray_82@yahoo.com) -      F1 for Help"
#define TITOLO "X Poker 2001 v1.08 beta"
#define Y 345
#define CREDITO 200
#define TRUE 1
#define FALSE 0

#define ERROR1 "Credito e/o Punti InSufficenti"
#define ERROR2 "Abassare la puntata,"
#define ERROR3 "o Modificare il Credito."

#define USCITA1 "Uscire da X Poker 2001 ?"
#define USCITA2 "<N> Torna a Giocare"
#define USCITA3 "<S> Esci e Salva Opzioni"
#define USCITA4 "<ESC> Esci Senza Salvare Opzioni"

#define ABOUT1 "X POKER 2001"
#define ABOUT2 "Version 1.08 beta"
#define ABOUT3 "Written by : Xray82"
#define ABOUT4 "Email : xray_82@yahoo.com"
#define ABOUT5 "CopyRight 2000-2001 LetoSoft (TM)"

#define HELP1  "<Q,W,E,R,T> Tieni Carta"
#define HELP2  "<O> Opzioni"
#define HELP3  "<F1> Help!"
#define HELP4  "<P> Aumenta Puntata"
#define HELP5  "Nel Raddoppio :"
#define HELP6  "<A> Carta ALTA"
#define HELP7  "<S> Carta BASSA"
#define HELP8  "<Z> Dimezza Puntata"
#define HELP9  "<X> Prendi Vincita"
#define HELP10 "<Esc> Uscita"

#define SETTA_TESTO_PUNTI settextstyle(3,0,1);
#define NOMEFILEOPZIONI "pokopz.dat"

#define LAMPIO2_STR "X POKER 2001"

#define POKERISSIMO 1000
#define POKER 100
#define ROYAL_COLOR 500
#define STRAIGHT_COLOR 200
#define FULL 40
#define COLOR 20
#define SCALA 10
#define TRIS 6
#define DOPPIA_COPPIA 4
#define ALTA_COPPIA 2
#define NENTI -1

#define POKERISSIMO_STR "X Poker"
#define POKER_STR "Poker"
#define ROYAL_COLOR_STR "Royal Color"
#define STRAIGHT_COLOR_STR "Straight Color"
#define FULL_STR "Full"
#define COLOR_STR  "Color"
#define SCALA_STR  "Straight"
#define TRIS_STR   "Tris"
#define DOPPIA_COPPIA_STR "Double Pairs"
#define ALTA_COPPIA_STR  "High Pairs"

#define PUNT "Punti : "
#define CRED "Credito : "
#define RIT_VIN 150
#define RIT2 200

int RIT_STAMPA=70;

//Dichiarazione Funzioni e variabili globali

void StampaVincitaIntermedia(int vincita);
int CalcolaPunteggio();
void stampacarta(int x,int y,int seme,int num);
void caricamazzo();
void DisegnaTavolo(void);
void ferma(int x,int carta);
void secondamano();
void help();
void StampaVincita(int vincita);
void SalvaOpzioni();
void CaricaOpzioni();
void AggiornaPunteggio();


char *pulsa_opzioni[]={"CREDITO","Ritardo Stampa Carte","Puntata","Salva Opzioni","A B O U T","Esci",""};
char semi[5]={12,MAGENTA,8,RED,BLUE} ;
struct Tcarte{
  int seme;
  int carta;
}carte[53];
int scelta[5][2];
long int punti=0,credito=CREDITO, primamano=FALSE;
int voltepunti=1;

//FINE

char *inttostr(long int x){
static char string [20];
ltoa(x,string,10);
return string;
}

void SalvaOpzioni(){
FILE *fp;
typedef struct TOpzioni {
  long int Credito;
  long int Punti;
  int RitardoStampa;
  int VoltePunti;
 } Opzioni;
Opzioni Opzioni1;
Opzioni1.Credito=credito;
Opzioni1.Punti=punti;
Opzioni1.RitardoStampa=RIT_STAMPA;
Opzioni1.VoltePunti=voltepunti;
 if ((fp=fopen(NOMEFILEOPZIONI,"wb"))!=NULL) {
  fwrite(&Opzioni1,sizeof(Opzioni),1,fp);
  fclose(fp);
  }
}

void CaricaOpzioni(){
FILE *fp;
typedef struct TOpzioni {
  long int Credito;
  long int Punti;
  int RitardoStampa;
  int VoltePunti;
 } Opzioni;
Opzioni Opzioni1;
if ((fp=fopen(NOMEFILEOPZIONI,"rb"))!=NULL) {
  fread(&Opzioni1,sizeof(Opzioni),1,fp);
  fclose(fp);
  credito=Opzioni1.Credito;
punti=Opzioni1.Punti;
RIT_STAMPA=Opzioni1.RitardoStampa;
 voltepunti=Opzioni1.VoltePunti;
  }

}


void AggiornaPunteggio(){
static long int cred=CREDITO,punt=0;
SETTA_TESTO_PUNTI
if (cred!=credito){
	 setcolor(BLACK);
	 outtextxy(640-textwidth(inttostr(cred)),35,inttostr(cred));
	 setcolor(WHITE);
	 cred=credito;
	 outtextxy(640-textwidth(inttostr(cred)),35,inttostr(cred));
						 }
if (punt!=punti){
	 setcolor(BLACK);
	 outtextxy(640-textwidth(inttostr(punt)),55,inttostr(punt));
	 setcolor(WHITE);
	 punt=punti;
	 outtextxy(640-textwidth(inttostr(punt)),55,inttostr(punt));
}
}

void StopAuto(){
int p,jo=FALSE,jo2=-1;
  int ct[5][2],sem[5];
  int k2,k,i,j;

 for (i=0;i<5;i++){   //carica le 5 carte nell'array CT
		 ct[i][0]=carte[scelta[i][0]].carta;
		 sem[i]=carte[scelta[i][0]].seme;
		 if (!ct[i][0]) {ct[i][1]=1; jo=TRUE; jo2=i;}
		 else ct[i][1]=0;
		 }

p=CalcolaPunteggio();
switch (p) {
	case POKERISSIMO :
		 for (i=0;i<5;++i) if ((jo==FALSE)||(i!=jo2)) ct[i][1]=1;
		 break;
	case POKER :
		 if (!jo){
			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (ct[i][0]==ct[j][0])
											{ for (k=0;k<5;++k)
													 if (ct[k][0]!=ct[i][0])
															 { for (i=0;i<5;++i) if (i!=k) ct[i][1]=1;
																break;
															  }

												break;
											 }
			 }
		 if (jo){
			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (ct[i][0]==ct[j][0])
											{	ct[i][1]=1;
												ct[j][1]=1;
												 for (k=0;k<5;++k)
														 if (ct[k][0]==ct[i][0])
															 {	ct[k][1]=1;
																break;
															  }

												break;
											 }
			 }
		 break;
	case SCALA :
		 for (i=0;i<5;++i) if ((jo==FALSE)||(i!=jo2)) ct[i][1]=1;
		 break;
	case ROYAL_COLOR :
		 for (i=0;i<5;++i) if ((jo==FALSE)||(i!=jo2)) ct[i][1]=1;
		 break;
	case STRAIGHT_COLOR :
		 for (i=0;i<5;++i) if ((jo==FALSE)||(i!=jo2)) ct[i][1]=1;
		 break;
	case COLOR :
		 for (i=0;i<5;++i) if ((jo==FALSE)||(i!=jo2)) ct[i][1]=1;
		 break;
   	case FULL :
		 for (i=0;i<5;++i) if ((jo==FALSE)||(i!=jo2)) ct[i][1]=1;
		 break;

	case NENTI :
	  {	 if (jo){
			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (sem[i]==sem[j])
										 for (k=j+1;k<5;++k)
												  if (sem[k]==sem[j])
											{	ct[i][1]=1;
												ct[j][1]=1;
												ct[k][1]=1;
												break;
											 }
			 }
		 if (!jo){
			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (sem[i]==sem[j])
										 for (k=j+1;k<5;++k)
												  if (sem[k]==sem[j])
															 for (k2=k+1;k2<5;++k2)
															  if (sem[k]==sem[k2])
																		{	ct[i][1]=1;
																			ct[j][1]=1;
																			ct[k][1]=1;
																			ct[k2][1]=1;
																			break;
																			 }
			}
	  }
	case TRIS :
		 if (jo){
			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (ct[i][0]==ct[j][0])
											{	ct[i][1]=1;
												ct[j][1]=1;
												break;
											 }
			 }
		 if (!jo){
			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (ct[i][0]==ct[j][0])
											{	ct[i][1]=1;
												ct[j][1]=1;
												 for (k=0;k<5;++k)
														 if (ct[k][0]==ct[i][0])
															 {	ct[k][1]=1;
																break;
															  }

												break;
											 }
			 }
		 break;
	case ALTA_COPPIA :
		 if (jo){
			 for (i=0;i<5;++i)
					 if ((ct[i][0]>=11)||(ct[i][0]==1))
								{ct[i][1]=1;
								 break;
								 }

			 }
		 if (!jo){
			 for (i=0;i<5;++i)
					 if ((ct[i][0]>=11)||(ct[i][0]==1))
								 for (j=i+1;j<5;++j)
									 if (ct[i][0]==ct[j][0])
											{	ct[i][1]=1;
												ct[j][1]=1;
												break;
											 }

			 }
		 break;
	case DOPPIA_COPPIA :

			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (ct[i][0]==ct[j][0])
											{	ct[i][1]=1;
												ct[j][1]=1;
												 for (k=0;k<5;++k)
														 if ((ct[k][0]!=ct[i][0]) && (ct[k][0]!=ct[j][0]))
															 for (j=k+1;j<5;++j)
															  if (ct[k][0]==ct[j][0])
																			 {	ct[k][1]=1;
																				 ct[j][1]=1;
																				break;
																				}


												break;
											 }

		 break;
	default :
			 for (i=0;i<5;++i)
					 for (j=i+1;j<5;++j)
									 if (ct[i][0]==ct[j][0])
											{	ct[i][1]=1;
												ct[j][1]=1;
												break;
											 }
		  break;


}

for (i=0;i<5;++i) if (ct[i][1]==1) ferma(67,i);
if (p!=-1) StampaVincitaIntermedia(p);
}


long int Raddoppio(long int vin2){
 char f;
 long int x,i,vinto=0,vin3,k=100;
 int cont=7;
 struct textsettingstype texttypeinfo;

 for(i=0;i<=4;i++)   {
	  setfillstyle(1,GREEN);
	  bar(50+(i*110),Y-50,150+(i*110),Y+80);
	  }
stampacarta(50+50,Y,0,0);
setcolor(RED);
outtextxy(400,120,"WIN");
setcolor(WHITE);
vin3=vin2;
outtextxy(400,150,inttostr(vin3));
 i=1;
 do {
  do
  f=getch();
  while ((toupper(f)!='A') &&(toupper(f)!='Z')&&(toupper(f)!='X')&&(toupper(f)!='S'));
  do x=random(53);   while (x==0);
  switch (toupper(f)){
	case 'A' :
			 stampacarta(k+(i*70),Y,carte[x].seme,carte[x].carta);
			  if (carte[x].carta>=7) {
					  setcolor(BLACK);
					  outtextxy(400,150,inttostr(vin3));
					  vin3=vin3*2;
					  setcolor(WHITE);
					  outtextxy(400,150,inttostr(vin3));
					  vinto=1;
						}
			  break;
	case 'S' :
			 stampacarta(50+50+(i*70),Y,carte[x].seme,carte[x].carta);
			  if (carte[x].carta<=7) {
					  setcolor(BLACK);
					  outtextxy(400,150,inttostr(vin3));
					  vin3=vin3*2;
					  setcolor(WHITE);
					  outtextxy(400,150,inttostr(vin3));
					  vinto=1;
						}
			  break;
	case 'Z' :
		 setcolor(BLACK);
		 outtextxy(400,150,inttostr(vin3));
		 if (vin3%2)
			 punti=punti+(vin3/2)+1;
			 else  punti=punti+(vin3/2);
		 vin3=vin3/2;
		 setcolor(WHITE);
		 outtextxy(400,150,inttostr(vin3));
		 vinto=1;
		 gettextsettings(&texttypeinfo);
		 AggiornaPunteggio();
		 settextstyle(texttypeinfo.font,texttypeinfo.direction,texttypeinfo.charsize);
		 break;

	case 'X' : vinto=1; break;
  }
  if ((!vinto)||(vin3==0))  {
			 delay(1000);
			 setfillstyle(1,BLACK);
			 bar(380,110,620,200);
			 return 0;
			 }
  else vinto=0;
  if (toupper(f)!='Z') i++;
  if (i==cont)  {
		i=0;
		k=k+30;
		cont--;
		}
	} while ((toupper(f)!='X'));

setfillstyle(1,BLACK);
bar(380,110,620,200);
return vin3;

}





void stampacarta(int x,int y,int seme,int num)  {
char msg[10];
setcolor(semi[seme]);
setfillstyle(1,semi[seme]);
fillellipse(x,y,50,50);
if (seme!=0) {
			setfillstyle(1,WHITE);
			pieslice(x,y,120,145,48);
			}
setfillstyle(1,semi[seme]);
fillellipse(x,y,27,27);
setfillstyle(1,WHITE);
itoa(num,msg,10);
if (seme!=0) fillellipse(x,y,25,25);
else strcpy(msg,"Jolly");
settextstyle(7, HORIZ_DIR,4);
setcolor(BLACK);
outtextxy(x-(textwidth(msg)/2),y-(textheight(msg)/2)-5,msg);
setcolor(WHITE);
circle(x,y,50);
if (seme!=0) {setcolor(BLACK);
circle(x,y,25); }
}


void caricamazzo(){
 int i,j;
 carte[0].seme=0;
 carte[0].carta=0;
 for (j=0;j<=3;j++)
 for(i=1;i<=13;i++){
 carte[(j*13)+i].seme=j+1;
 carte[(j*13)+i].carta=i;
 }
 for(i=0;i<=4;i++){
	 Again: scelta[i][0]=random(53);
		scelta[i][1]=0;
		 if (i>0)
	 for(j=0;j<=i-1;j++) if (scelta[i][0]==scelta[j][0]) goto Again;
 }
 for(i=0;i<=4;i++) scelta[i][1]=0;

}

void DisegnaTavolo(void){
setfillstyle(1,GREEN) ;
setcolor(GREEN);
bar(10,270,630,440);
setfillstyle(1,BROWN) ;
setcolor(BROWN);
pieslice(30,290,90,180,30);
pieslice(610,290,0,90,30);
pieslice(610,422,270,360,30);
pieslice(30,422,180,270,30);
bar(30,260,610,280);
bar(30,432,610,452);
bar(0,290,20,422);
bar(620,290,640,422);
setfillstyle(1,WHITE);
setcolor(WHITE);
pieslice(30,290,90,180,28);
pieslice(610,290,0,90,28);
pieslice(610,422,270,360,28);
pieslice(30,422,180,270,28);

for(int i=0;i<=16;i++){
line(320-20+i,262+i,320+20-i,262+i);
line(320-20+i,450-i,320+20-i,450-i);
}
//bar(320-15,263,320+15,263+14);

//bar(320-15,435,320+15,435+14);


setfillstyle(1,BROWN) ;
setcolor(BROWN);
pieslice(30,290,90,180,11);
pieslice(610,290,0,90,11);
pieslice(610,422,270,360,11);
pieslice(30,422,180,270,11);

setfillstyle(1,GREEN) ;
setcolor(GREEN);
pieslice(30,290,90,180,9);
pieslice(610,290,0,90,9);
pieslice(610,422,270,360,9);
pieslice(30,422,180,270,9);

settextstyle(0,0,1);
setcolor(WHITE);
settextstyle(0,0,0);
outtextxy(320-(textwidth(COP)/2),460,COP);
}

void lampio2(){
int x,y;
setfillstyle(1,GREEN) ;
bar(40,285,590,430);
//bar(21,290,30,422);
//bar(610,290,620,422);
settextstyle(10,0,5);
x=320-(textwidth(LAMPIO2_STR)/2);
y=252+((450-262)/2)-(textheight(LAMPIO2_STR)-35);
while (!kbhit()){
		setcolor(RED);
		outtextxy(x,y,LAMPIO2_STR);
		delay(RIT2);
		setcolor(GREEN);
		outtextxy(x,y,LAMPIO2_STR);
		delay(RIT2);
		 }
}

void lampiio(int x,int y,char text[50]){
  do     {
  while (!kbhit()){
		setcolor(RED);
		outtextxy(x,y,text);
		delay(RIT_VIN);
		setcolor(BLACK);
		outtextxy(x,y,text);
		delay(RIT_VIN);
		 }
		 setcolor(WHITE);
		outtextxy(x,y,text);
		 }
  while (getch()!=13);
}





void StampaVincitaIntermedia(int vincita){
setcolor(RED);
SETTA_TESTO_PUNTI
switch (vincita) {

	 case POKERISSIMO    : outtextxy(20,35,POKERISSIMO_STR);break;
	 case ROYAL_COLOR    : outtextxy(20,55,ROYAL_COLOR_STR);       break;
	 case STRAIGHT_COLOR : outtextxy(20,75,STRAIGHT_COLOR_STR);   break;
	 case POKER          : outtextxy(20,95,POKER_STR); break;
	 case FULL           : outtextxy(20,115,FULL_STR);  break;
	 case COLOR          : outtextxy(20,135,COLOR_STR);      break;
	 case SCALA          : outtextxy(20,155,SCALA_STR);    break;
	 case	TRIS           : outtextxy(20,175,TRIS_STR);     break;
	 case	DOPPIA_COPPIA  : outtextxy(20,195,DOPPIA_COPPIA_STR);     break;
	 case	ALTA_COPPIA    : outtextxy(20,215,ALTA_COPPIA_STR);     break;
  }
}

void StampaVincita(int vincita){
setcolor(WHITE);
SETTA_TESTO_PUNTI
switch (vincita) {
	 case NENTI : {
		setcolor(YELLOW);
		outtextxy(560-textwidth(CRED),35,CRED);
		setcolor(LIGHTGREEN);
		outtextxy(560-textwidth(PUNT),55,PUNT);
		setcolor(RED);
		outtextxy(385,35,"Puntata");
		setcolor(WHITE);
		outtextxy(640-textwidth(inttostr(credito)),35,inttostr(credito));
		outtextxy(640-textwidth(inttostr(punti)),55,inttostr(punti));
		outtextxy(410,55,inttostr(ALTA_COPPIA*voltepunti));
		setcolor(WHITE);
		outtextxy(20,35,POKERISSIMO_STR);
		outtextxy(20,55,ROYAL_COLOR_STR);
		outtextxy(20,75,STRAIGHT_COLOR_STR);
		outtextxy(20,95,POKER_STR);
		outtextxy(20,115,FULL_STR);
		outtextxy(20,135,COLOR_STR);
		outtextxy(20,155,SCALA_STR);
		outtextxy(20,175,TRIS_STR);
		outtextxy(20,195,DOPPIA_COPPIA_STR);
		outtextxy(20,215,ALTA_COPPIA_STR);
		break; }
	 case POKERISSIMO    : {lampiio(20, 35,POKERISSIMO_STR);break;}
	 case ROYAL_COLOR    : {lampiio(20, 55,ROYAL_COLOR_STR);break;}
	 case STRAIGHT_COLOR : {lampiio(20, 75,STRAIGHT_COLOR_STR);break;}
	 case POKER          : {lampiio(20, 95,POKER_STR);break;}
	 case FULL           : {lampiio(20,115,FULL_STR);break;}
	 case COLOR          : {lampiio(20,135,COLOR_STR);break;}
	 case SCALA          : {lampiio(20,155,SCALA_STR); break; }
	 case TRIS           : {lampiio(20,175,TRIS_STR); break; }
	 case DOPPIA_COPPIA  : {lampiio(20,195,DOPPIA_COPPIA_STR); break; }
	 case ALTA_COPPIA    : {lampiio(20,215,ALTA_COPPIA_STR); break;}
	}//fine Swithc

}


void StampaPunti(long int k, long int prima){
setfillstyle(1,BLACK);
bar(200,30,350,240);

setcolor(BLACK);
SETTA_TESTO_PUNTI
outtextxy(410,55,inttostr(ALTA_COPPIA*prima));
setcolor(WHITE);
SETTA_TESTO_PUNTI
	outtextxy(410,55,inttostr(ALTA_COPPIA*k));
		outtextxy(200, 35,inttostr(POKERISSIMO*k));
		outtextxy(200, 55,inttostr(ROYAL_COLOR*k));
		outtextxy(200, 75,inttostr(STRAIGHT_COLOR*k));
		outtextxy(200, 95,inttostr(POKER*k));
		outtextxy(200,115,inttostr(FULL*k));
		outtextxy(200,135,inttostr(COLOR*k));
		outtextxy(200,155,inttostr(SCALA*k));
		outtextxy(200,175,inttostr(TRIS*k));
		outtextxy(200,195,inttostr(DOPPIA_COPPIA*k));
		outtextxy(200,215,inttostr(ALTA_COPPIA*k));
}

void ferma(int x,int carta){
if (scelta[carta][1]==0) {
		 setcolor(BLACK);
		 settextstyle(7,0,1);
		 outtextxy((x+(carta*110))+10,Y+55,"STOP");
		 scelta[carta][1]=1;
	}
else { setcolor(GREEN);
		 settextstyle(7,0,1);
		 outtextxy((x+(carta*110))+10,Y+55,"STOP");
		 scelta[carta][1]=0;}
}



void secondamano(){
	int vin,i,j;

 for(i=0;i<=4;i++)   {
	if (scelta[i][1]==0){
	  setfillstyle(1,GREEN);
	  bar(50+(i*110),Y-50,150+(i*110),Y+50);

		  }
  }

 for(i=0;i<=4;i++)   {
	if (scelta[i][1]==0){
	  Again2: scelta[i][0]=random(53);
	  for(j=0;j<=4;j++) if((i!=j)&&(scelta[i][0]==scelta[j][0])) goto Again2;
	  delay(RIT_STAMPA);
	  stampacarta(50+50+(i*110),Y,carte[scelta[i][0]].seme,carte[scelta[i][0]].carta);

	  }
  }
 vin=CalcolaPunteggio();
  if (vin!=NENTI) {
			  StampaVincita(vin);
			  punti=punti+Raddoppio(vin*voltepunti);
			  AggiornaPunteggio();
			  }
  else for(;getch()!=13;);
  primamano=FALSE;
}

void Uscita(){
void *temp2;
char c;
temp2=malloc(imagesize(170,140,470,340));
getimage(170,140,470,340,temp2);
finestra(170,140,300,200,0,USCITA1);
settextstyle(0,0,0);
setcolor(BLACK);
outtextxy(190,210,USCITA2);
outtextxy(190,230,USCITA3);
outtextxy(190,250,USCITA4);
for(;((c=getch())!=27)&&(toupper(c)!='S')&&(toupper(c)!='N'););

switch (toupper(c)) {
  case 27 :
		  closegraph();
		  exit(0);
		  break;
  case 'N':
		  putimage(170,140,temp2,0);
		  free(temp2);
		  break;
  case 'S':
		  SalvaOpzioni();
		  free(temp2);
		  closegraph();
		  exit(0);
		  break;
}

}

void about(){
void *temp2;
temp2=malloc(imagesize(170,140,470,340));
getimage(170,140,470,340,temp2);
finestra(170,140,300,200,0,"A B O U T");
settextstyle(0,0,0);
setcolor(BLACK);
outtextxy(190,190,ABOUT1);
outtextxy(190,210,ABOUT2);
outtextxy(190,230,ABOUT3);
outtextxy(190,250,ABOUT4);
outtextxy(190,270,ABOUT5);
for(char c;(((c=getch())!=27 )&&(c!=13)) ;);
putimage(170,140,temp2,0);
free(temp2);

}

void help(){
void *temp2;
temp2=malloc(imagesize(170,140,470,340));
getimage(170,140,470,340,temp2);
finestra(170,140,300,200,0,"Help");
settextstyle(0,0,0);
setcolor(BLACK);
outtextxy(190,180,HELP1);
outtextxy(190,195,HELP2);
outtextxy(190,210,HELP3);
outtextxy(190,225,HELP4);
outtextxy(190,240,HELP5);
outtextxy(190,255,HELP6);
outtextxy(190,270,HELP7);
outtextxy(190,285,HELP8);
outtextxy(190,300,HELP9);
outtextxy(190,320,HELP10);
for(char c;(((c=getch())!=27 )&&(c!=13)) ;);
putimage(170,140,temp2,0);
free(temp2);

}



void SalvaOpzioniFinestra(){
void *temp2;
temp2=malloc(imagesize(220,190,420,290));
getimage(220,190,420,290,temp2);
finestra(220,190,200,100,0,"Information :)");
settextstyle(0,0,0);
setcolor(BLACK);
outtextxy(240,240,"Opzioni Salvate!");
outtextxy(240,260,"<Esc> Uscita");
for(char c;(((c=getch())!=27 )&&(c!=13)) ;);
putimage(220,190,temp2,0);
free(temp2);
}

int CalcolaPunteggio(){
  int ct[5][2];
  int i,j,t;
 for (i=0;i<5;i++){   //carica le 5 carte nell'array CT
		 ct[i][0]=carte[scelta[i][0]].carta;
		 ct[i][1]=carte[scelta[i][0]].seme;
		 }

 for(i=0;i<4;i++)          // ordina CT
  for(j=0;j<4;j++)
	if (ct[j][0]>ct[j+1][0]) {
	 t=ct[j+1][0];
	 ct[j+1][0]=ct[j][0];
	 ct[j][0]=t;
	 t=ct[j+1][1];
	 ct[j+1][1]=ct[j][1];
	 ct[j][1]=t;
	 }

	// Controllo Colore   con Jolly
	if (   ((ct[0][1]==ct[1][1])&&(ct[1][1]==ct[2][1])&&(ct[2][1]==ct[3][1])
	  &&(ct[3][1]==ct[4][1])) ||
	  ((ct[0][1]==0)&&(ct[1][1]==ct[2][1])&&(ct[2][1]==ct[3][1])
	  &&(ct[3][1]==ct[4][1]))
		)
		{  //controllo Royal Color con Jolly
	  if ( ((ct[0][0]==1)&&(ct[1][0]==10)&&(ct[2][0]==11)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 //con Jolly
			 ((ct[0][0]==0)&&(ct[1][0]==10)&&(ct[2][0]==11)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==11)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==10)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==10)&&(ct[3][0]==11)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==10)&&(ct[3][0]==11)
		&&(ct[4][0]==12))
		  )   return ROYAL_COLOR;

	  //Control   StraightColor
	 if ( ((ct[1][0]==ct[0][0]+1)&&(ct[2][0]==ct[0][0]+2)&&(ct[3][0]==ct[0][0]+3)
		&&(ct[4][0]==ct[0][0]+4))   ||
			 //con Jolly
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+1)&&(ct[3][0]==ct[1][0]+2)
		&&(ct[4][0]==ct[1][0]+3))   ||
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+2)&&(ct[3][0]==ct[1][0]+3)
		&&(ct[4][0]==ct[1][0]+4))   ||
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+1)&&(ct[3][0]==ct[1][0]+3)
		&&(ct[4][0]==ct[1][0]+4))   ||
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+1)&&(ct[3][0]==ct[1][0]+2)
		&&(ct[4][0]==ct[1][0]+4))
		  )   return STRAIGHT_COLOR;
		 return COLOR;
		}
	//Controllo POKERisssimo
	 if  (  (ct[0][0]==0) && (ct[1][0]==ct[2][0])&& (ct[2][0]==ct[3][0])
		 && (ct[3][0]==ct[4][0]) )  return POKERISSIMO;
	 //Controllo POKER anche conjolly
	 if  (  ((ct[0][0]!=ct[1][0]) && (ct[1][0]==ct[2][0])&& (ct[2][0]==ct[3][0])
		 && (ct[3][0]==ct[4][0]))  ||
		((ct[0][0]==ct[1][0]) && (ct[1][0]==ct[2][0])&& (ct[2][0]==ct[3][0])
		 && (ct[3][0]!=ct[4][0]))  ||
		((ct[0][0]==0) && (ct[1][0]==ct[2][0])&& (ct[2][0]==ct[3][0])
		 && (ct[3][0]!=ct[4][0]) )  ||
		((ct[0][0]==0) && (ct[1][0]!=ct[2][0])&& (ct[2][0]==ct[3][0])
		 && (ct[3][0]==ct[4][0])  )
	)  return POKER;
	 //Controllo Full ANCHE Con Jolly
	 if ( ( (ct[0][0]==ct[1][0]) && (ct[1][0]==ct[2][0])&& (ct[3][0]==ct[4][0])
		 ) ||
		((ct[0][0]==ct[1][0]) && (ct[2][0]==ct[3][0])&& (ct[3][0]==ct[4][0])
		 )  ||
		((ct[0][0]==0) && (ct[1][0]==ct[2][0])&& (ct[3][0]==ct[4][0])
		 )
	) return FULL;
	  //Controllo scala
	 if ( ((ct[0][0]==1)&&(ct[1][0]==10)&&(ct[2][0]==11)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 //con Jolly
			 ((ct[0][0]==0)&&(ct[1][0]==10)&&(ct[2][0]==11)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==11)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==10)&&(ct[3][0]==12)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==10)&&(ct[3][0]==11)
		&&(ct[4][0]==13))   ||
			 ((ct[0][0]==0)&&(ct[1][0]==1)&&(ct[2][0]==10)&&(ct[3][0]==11)
		&&(ct[4][0]==12))  ||
	 ((ct[1][0]==ct[0][0]+1)&&(ct[2][0]==ct[0][0]+2)&&(ct[3][0]==ct[0][0]+3)
		&&(ct[4][0]==ct[0][0]+4))   ||
			 //con Jolly
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+1)&&(ct[3][0]==ct[1][0]+2)
		&&(ct[4][0]==ct[1][0]+3))   ||
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+2)&&(ct[3][0]==ct[1][0]+3)
		&&(ct[4][0]==ct[1][0]+4))   ||
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+1)&&(ct[3][0]==ct[1][0]+3)
		&&(ct[4][0]==ct[1][0]+4))   ||
			((ct[0][0]==0)&&(ct[2][0]==ct[1][0]+1)&&(ct[3][0]==ct[1][0]+2)
		&&(ct[4][0]==ct[1][0]+4))
		  )   return SCALA;
	 //controllo Tris
	 if (   ((ct[0][0]==ct[1][0]) && (ct[1][0]==ct[2][0])) ||
		((ct[1][0]==ct[2][0]) && (ct[2][0]==ct[3][0])) ||
		((ct[2][0]==ct[3][0]) && (ct[3][0]==ct[4][0])) ||
		((ct[0][0]==0) && (ct[1][0]==ct[2][0])) ||
		((ct[0][0]==0) && (ct[2][0]==ct[3][0])) ||
		((ct[0][0]==0) && (ct[3][0]==ct[4][0]))
	) return TRIS;
	 //controllo doppia coppia
	if ( ((ct[0][0]==ct[1][0]) && (ct[2][0]==ct[3][0])) ||
	((ct[1][0]==ct[2][0]) && (ct[3][0]==ct[4][0])) ||
	((ct[0][0]==ct[1][0]) && (ct[3][0]==ct[4][0]))
	) return DOPPIA_COPPIA;
	 //controllo Alta Coppia
	 if (  ( (ct[0][0]==ct[1][0]) && ((ct[0][0]>10)||(ct[0][0]==1)) ) ||
	  ( (ct[1][0]==ct[2][0]) && (ct[1][0]>10)) ||
	  ( (ct[2][0]==ct[3][0]) && (ct[2][0]>10)) ||
	  ( (ct[3][0]==ct[4][0]) && (ct[3][0]>10)) ||
	  ( (ct[0][0]==0) && ((ct[1][0]>10)||(ct[1][0]==1))) ||
	  ( (ct[0][0]==0) && (ct[2][0]>10)) ||
	  ( (ct[0][0]==0) && (ct[3][0]>10)) ||
	  ( (ct[0][0]==0) && (ct[4][0]>10))
	) return ALTA_COPPIA;

return NENTI;

}

void mano(){
int i;
for(i=0;i<=4;i++) {
	 if (scelta[i][1]==1)ferma(100,i);
		}
for(i=0;i<=4;i++)   {
stampacarta(50+50+(i*110),Y,carte[scelta[i][0]].seme,carte[scelta[i][0]].carta);
delay(RIT_STAMPA);
}

}



void main()   {
long int temp,temp2,selected;
char ch;
randomize();
CaricaOpzioni();
IniziaGrafica();
//finestra(220,0,200,27,14,TITOLO);
setcolor(LIGHTGRAY);
settextstyle(0,0,1);
outtextxy(320-(textwidth(TITOLO)/2),10,TITOLO);
setcolor(WHITE);
settextstyle(0,0,0);
DisegnaTavolo();
StampaVincita(NENTI);
StampaPunti(voltepunti,0);
AggiornaPunteggio();
dinuovo:  lampio2();

do{
 ch=getch();
switch (toupper(ch)) {
 case 27  :
		  Uscita();
		  break;
 case 13  :
			{
			caricamazzo();
			primamano=TRUE;
			if (credito>=(ALTA_COPPIA*voltepunti))
					credito=credito-(ALTA_COPPIA*voltepunti);
			else
			{
			  temp=(ALTA_COPPIA*voltepunti)-credito;
			  temp2=punti;
			  punti=punti-temp;
				if (punti<0) {
				 finestra(175,300,300,100,0,"Error !!");
				 setcolor(BLACK);
				 outtextxy(200,340,ERROR1);
				 outtextxy(200,357,ERROR2);
				 outtextxy(200,357+17,ERROR3);
				 getch();
				 punti=temp2;
				 goto dinuovo;
				 }
				  if (credito!=0) credito=0;
			  }
			AggiornaPunteggio();
		 mano();
		 StopAuto();
		 break;
			}

 case NULL :
		 if (getch()==59) {help(); lampio2();  }
		 break;
 case 'O' :
	  do {
		 selected=menu(220,140,200,200,"O P Z I O N I",pulsa_opzioni);
		 settextstyle(0,0,0);
		 switch (selected) {
			case 1 :
					  credito=atol(edit(250,210,5,TRUE,"Credito"));
					  AggiornaPunteggio();
					  break;
			case 2 :
					  RIT_STAMPA=atoi(edit(250,210,3,TRUE,"Delay Stampa Carte"));
					  break;
			case 3 :
					  temp2=voltepunti;
					  do
					  voltepunti=atoi(edit(250,210,2,TRUE,"Puntata (2-98)"))/2;
					  while ((voltepunti<1)||(voltepunti>99));
					  StampaPunti(voltepunti,temp2);
					  break;
			case 4 :
					  SalvaOpzioni();
					  SalvaOpzioniFinestra();
					  break;
			case 5 :
					  about();
					  break;
			case 6 :
					 break;

		 }
	  }while ((selected!=-1)&&(selected!=6));
		 lampio2();
		 break;
 case 'P' :
		  if (voltepunti<49){
				 voltepunti++;
				 StampaPunti(voltepunti,voltepunti-1);
				 }
		  else StampaPunti(voltepunti=1,49);
		  lampio2();
		  break;
 default :  lampio2();  break;
		}
 }while (ch!=13);


do{
 ch=getch();
switch (toupper(ch)) {
 case 'Q' :
	  ferma(67,0);
	  break;
 case 'W' :
	  ferma(67,1);
	  break;
 case 'E' :
	  ferma(67,2);
	  break;
 case 'R' :
	  ferma(67,3);
	  break;
 case 'T' :
	  ferma(67,4);
	  break;
 case 13  :
		  StampaVincita(NENTI);
		  secondamano();
		  break;
 default :    break;
		}
 }while (ch!=13);



goto dinuovo;

}