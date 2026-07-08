package photo.software.admin.id;

import java.awt.Color;
import java.awt.Font;


public class Template 
{
	
	public Font nameFont,barcodeFont,idFont,homeFont,e1Font,e2Font;
	public Color nameColor, barcodeColor, idColor, homeColor,e1Color,e2Color,yearColor;
	public String plan,vertical,border,nF;
	public int id, iX, iY, iW, nX, nY, nW, fX, fY, lX, lY, bX, bY, bS, 
					hX, hY, hW, hS, idX, idY, idS, e1X, e1Y, e1W, e1S, e2X, e2Y, e2W, e2S, yX, yY, qrX, qrY, qrSize;
	public Template()
	{
		this.vertical = "false";
	}
	
	public Template(String id, String plan, String vertical,
			String iX, String iY, String iW,
			String nX, String nY, String nW,
			String fX, String fY, String lX, String lY,
			String nC, String nF, String nS,
			String bX, String bY,String bF,String bS,
			String hX, String hY, String hW, String hC, String hF, String hS,
			String idX, String idY, String idF, String idS,
			String e1X, String e1Y, String e1W, String e1C, String e1F, String e1S,
			String e2X, String e2Y, String e2W, String e2C, String e2F, String e2S,
			String yX, String yY, String yColor,
			String qrX, String qrY, String qrSize)
	{		
		this.id = Integer.parseInt(id);
		this.plan = plan;
		this.vertical = vertical;
		
		//Image Variables
		this.iX=Integer.parseInt(iX);
		this.iY=Integer.parseInt(iY);
		this.iW=Integer.parseInt(iW);
		
		//Name Variables
		this.nX=Integer.parseInt(nX);
		this.nY=Integer.parseInt(nY);
		this.nW=Integer.parseInt(nW);
		this.nF=nF;
		nameFont=setFont(nF, nS);
		nameColor=setColor(nC);
		
		this.lX=Integer.parseInt(lX);
		this.lY=Integer.parseInt(lY);
		this.fX=Integer.parseInt(fX);
		this.fY=Integer.parseInt(fY);
		
		//Barcode Variables
		this.bX=Integer.parseInt(bX);
		this.bY=Integer.parseInt(bY);
		barcodeFont=setFont(bF.trim(),bS);
		barcodeColor = Color.black;
		
		//Homeroom Variables
		this.hX=Integer.parseInt(hX);
		this.hY=Integer.parseInt(hY);
		this.hW=Integer.parseInt(hW);
		homeFont=setFont(hF, hS);
		homeColor=setColor(hC);
		
		//ID1 Variables
		this.idX=Integer.parseInt(idX);
		this.idY=Integer.parseInt(idY);
		idFont=setFont(idF, idS);
		idColor=Color.black;
		
		//Extra1 Variables
		this.e1X=Integer.parseInt(e1X);
		this.e1Y=Integer.parseInt(e1Y);
		this.e1W=Integer.parseInt(e1W);
		e1Font=setFont(e1F, e1S);
		e1Color=setColor(e1C);
		
		//Extra2 Variables
		this.e2X=Integer.parseInt(e2X);
		this.e2Y=Integer.parseInt(e2Y);
		this.e2W=Integer.parseInt(e2W);
		e2Font=setFont(e2F, e2S);
		e2Color=setColor(e2C);
		
		//Year Variables
		this.yX=Integer.parseInt(yX);
		this.yY=Integer.parseInt(yY);
		this.yearColor=setColor(yColor);
		
		//Size Variables
		this.qrX=Integer.parseInt(qrX);
		this.qrY=Integer.parseInt(qrY);
		this.qrSize=Integer.parseInt(qrSize);
		
	}
	private Color setColor(String s)
	{
		if(s.equals("Red"))
		{
			return Color.red;
		}
		else if(s.equals("White"))
		{
			return Color.white;
		}
		else if(s.equals("Black"))
			return Color.black;
		return Color.black;
	}
	private Font setFont(String font, String size)
	{
		if(font.contains("39")) return new Font(font,Font.PLAIN,Integer.parseInt(size));
		return new Font(font,Font.BOLD,Integer.parseInt(size));
	}

	
}