package photo.software.render.addons;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Scanner;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import org.apache.commons.lang.WordUtils;

import photo.software.render.RenderOrder;
import photo.software.render.RenderOrders;

public class CDEnvelopeGenerator 
{
	private ArrayList<RenderOrder> cds;
	private String renderpath;
	private RenderOrders orders;
	
	BufferedImage background, overlay, sImage,rImage;
	Graphics2D bGraphics, oGraphics, sGraphics,rGraphics,gResult;
	Image resized;
	
	int fontSize;
	String plan = "";
	File planFile;
	Scanner planScan;
	String planLine, school;
	String[] p;
	int nameX, nameY, maxW, font1S, activeSize1, 
		schoolX, schoolY, schoolW, font2S, activeSize2,
		homeX, homeY, homeW, font3S, activeSize3;
	boolean nameC, nameP, schoolC, homeC;
	String color1, font1, color2, font2, color3, font3;
	
	FontMetrics fm;
	
	public CDEnvelopeGenerator(ArrayList<RenderOrder> cds, String renderpath, RenderOrders orders)
	{
		this.cds = cds;
		this.renderpath = renderpath;
		this.orders = orders;
		
		
		start();
	}
	private void start()
	{
		for(int i=0;i<cds.size();i++)
		{
			if((plan.equals(""))||(!plan.equals(cds.get(i).plan)))
			{
				school = cds.get(i).schoolName;
				plan = cds.get(i).plan;
				if(overlay!=null) overlay.flush();
				overlay = null;
				try
				{
					planFile = new File("Templates\\PACKAGE_PLANS\\"+plan+"\\CDEnvelopes.txt");
					if(planFile.exists())
					{
						initializeVariables();
						planScan = new Scanner(planFile);
						while(planScan.hasNext())
						{
							planLine = planScan.nextLine();
							p = planLine.split("\t");
							if(p[0].contains("Name Center (Y/N):")){
								if(p[1].contains("Y")) nameC = true;
								else nameC = false;
							}
							else if(p[0].contains("Name Proper (Y/N):")){
								if(p[1].contains("Y")) nameP = true;
								else nameP = false;
							}
							else if(p[0].contains("Name Start X:")) nameX = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Bottom Y:")) nameY = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Max Width:")) maxW = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Size:")) font1S = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Color:")) color1 = p[1];
							else if(p[0].contains("Name Font:")) font1 = p[1];
							else if(p[0].contains("School Center (Y/N):")){
								if(p[1].contains("Y")) schoolC = true;
								else schoolC = false;
							}
							else if(p[0].contains("School Start X:")) schoolX = Integer.parseInt(p[1]);
							else if(p[0].contains("School Bottom Y:")) schoolY = Integer.parseInt(p[1]);
							else if(p[0].contains("School Max Width:")) schoolW = Integer.parseInt(p[1]);
							else if(p[0].contains("School Size:")) font2S = Integer.parseInt(p[1]);
							else if(p[0].contains("School Color:")) color2 = p[1];
							else if(p[0].contains("School Font:")) font2 = p[1];
							else if(p[0].contains("Homeroom Center (Y/N):")){
								if(p[1].contains("Y")) homeC = true;
								else homeC = false;
							}
							else if(p[0].contains("Homeroom Start X:")) homeX = Integer.parseInt(p[1]);
							else if(p[0].contains("Homeroom Bottom Y:")) homeY = Integer.parseInt(p[1]);
							else if(p[0].contains("Homeroom Max Width:")) homeW = Integer.parseInt(p[1]);
							else if(p[0].contains("Homeroom Size:")) font3S = Integer.parseInt(p[1]);
							else if(p[0].contains("Homeroom Color:")) color3 = p[1];
							else if(p[0].contains("Homeroom Font:")) font3 = p[1];
							
						}
						planScan.close();
					}
					overlay = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\CDEnvelope.jpg"));
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading CD_Envelope Template: "+e);return;}
			}
			
			background = new BufferedImage(1470,1920,BufferedImage.TYPE_INT_RGB);
			bGraphics = background.createGraphics();
			bGraphics.setColor(Color.white);
			bGraphics.drawRect(0, 0, 2550, 1650);
			
			positioner(cds.get(i).first, cds.get(i).last, cds.get(i).homeroom);
			writeFinal(cds.get(i).last+"_"+cds.get(i).first+"_Env_"+i+".jpg");
			
			background.flush();
			background = null;
			orders.updateProgressBar((i*100)/cds.size(), "CDs: "+cds.get(i).last+", "+cds.get(i).first);
		}
		overlay.flush();
		overlay = null;

	}
	private void positioner(String firstName, String lastName, String homeroom)
	{
		bGraphics.drawImage(overlay, null, 0, 0);
		if(nameX!=0&&nameY!=0)
		{
			if(nameP)
			{
				firstName = WordUtils.capitalizeFully(firstName);
				lastName = WordUtils.capitalizeFully(lastName);
			}
			Color fontColor;
			if(color1.contains(","))
			{
				String c[] = color1.split(",");
				bGraphics.setColor(new Color(Integer.parseInt(c[0]),Integer.parseInt(c[1]),Integer.parseInt(c[2])));
			}
			else
			{
				try {
				    Field field = Class.forName("java.awt.Color").getField(color1);
				    fontColor = (Color)field.get(null);
				} catch (Exception e) {
					fontColor = null; // Not defined
				}
				bGraphics.setColor(fontColor);
			}
			activeSize1 = font1S;
			bGraphics.setFont(new Font(font1,Font.PLAIN,activeSize1));
			fm = bGraphics.getFontMetrics();
			while(fm.stringWidth(firstName+" "+lastName)>maxW)
			{
				activeSize1--;
				bGraphics.setFont(new Font(font1,Font.PLAIN,activeSize1));
				fm = bGraphics.getFontMetrics();
			}
			if(nameC) bGraphics.drawString(firstName+" "+lastName, nameX-(fm.stringWidth(firstName+" "+lastName)/2), nameY);
			else bGraphics.drawString(firstName+" "+lastName, nameX, nameY);
		}
		if(schoolX!=0&&schoolY!=0)
		{
			Color fontColor;
			if(color2.contains(","))
			{
				String c[] = color2.split(",");
				bGraphics.setColor(new Color(Integer.parseInt(c[0]),Integer.parseInt(c[1]),Integer.parseInt(c[2])));
			}
			else
			{
				try {
				    Field field = Class.forName("java.awt.Color").getField(color2);
				    fontColor = (Color)field.get(null);
				} catch (Exception e) {
					fontColor = null; // Not defined
				}
				bGraphics.setColor(fontColor);
			}
			activeSize2 = font2S;
			bGraphics.setFont(new Font(font2,Font.PLAIN,activeSize2));
			fm = bGraphics.getFontMetrics();
			while(fm.stringWidth(school)>schoolW)
			{
				activeSize2--;
				bGraphics.setFont(new Font(font2,Font.PLAIN,activeSize2));
				fm = bGraphics.getFontMetrics();
			}
			if(schoolC) bGraphics.drawString(school, schoolX-(fm.stringWidth(school)/2), schoolY);
			else bGraphics.drawString(school, schoolX, schoolY);
		}
		if(homeX!=0&&homeY!=0)
		{
			Color fontColor;
			if(color3.contains(","))
			{
				String c[] = color3.split(",");
				bGraphics.setColor(new Color(Integer.parseInt(c[0]),Integer.parseInt(c[1]),Integer.parseInt(c[2])));
			}
			else
			{
				try {
				    Field field = Class.forName("java.awt.Color").getField(color3);
				    fontColor = (Color)field.get(null);
				} catch (Exception e) {
					fontColor = null; // Not defined
				}
				bGraphics.setColor(fontColor);
			}
			activeSize3 = font3S;
			bGraphics.setFont(new Font(font3,Font.PLAIN,activeSize3));
			fm = bGraphics.getFontMetrics();
			while(fm.stringWidth(homeroom)>homeW)
			{
				activeSize3--;
				bGraphics.setFont(new Font(font3,Font.PLAIN,activeSize3));
				fm = bGraphics.getFontMetrics();
			}
			if(homeC) bGraphics.drawString(homeroom, homeX-(fm.stringWidth(homeroom)/2), homeY);
			else bGraphics.drawString(homeroom, homeX, homeY);
		}
	}
	private void initializeVariables()
	{
		nameX=0;
		nameY=0;
		maxW=0;
		font1S=0;
		activeSize1=0;
		schoolX=0;
		schoolY=0;
		schoolW=0;
		font2S=0;
		activeSize2=0;
		homeX=0;
		homeY=0;
		homeW=0;
		font3S=0;
		activeSize3=0;
		nameC = false; 
		nameP = false;
		schoolC=false;
		homeC=false;
		color1="black";
		font1="Arial";
		color2="black";
		font2="Arial";
		color3="black";
		font3="Arial";
	}
	private void writeFinal(String text)
	{
		try
		{
			ImageIO.write(background, "jpg", new File(renderpath+"\\"+text));
		}
		catch(IOException e){JOptionPane.showMessageDialog(null, "Error Writing: "+text+"\n"+e);}
	}
}
