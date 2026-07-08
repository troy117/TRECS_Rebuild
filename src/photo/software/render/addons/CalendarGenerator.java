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

public class CalendarGenerator 
{
	private ArrayList<RenderOrder> calendars;
	private String renderpath;
	
	BufferedImage background, overlay, sImage,rImage;
	Graphics2D bGraphics, oGraphics, sGraphics,rGraphics,gResult;
	Image resized;
	RenderOrders orders;
	String plan="";
	FontMetrics fm;
	int nameSize;
	
	File planFile;
	Scanner planScan;
	String planLine;
	String[] p;
	int topX, topY, imgW, nameX, nameY, maxW, fontS, activeSize;
	boolean nameC, nameP;
	String color, font;
	
	public CalendarGenerator(ArrayList<RenderOrder> calendars, String renderpath, RenderOrders orders)
	{
		this.calendars = calendars;
		this.renderpath = renderpath;
		this.orders = orders;
		
		start();
	}
	private void start()
	{
		for(int i=0;i<calendars.size();i++)
		{
			if(plan.equals("")||(!plan.equals(calendars.get(i).plan)))
			{
				plan = calendars.get(i).plan;
				if(overlay!=null) overlay.flush();
				overlay = null;
				try
				{
					planFile = new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Calendar.txt");
					if(planFile.exists())
					{
						initializeVariables();
						planScan = new Scanner(planFile);
						while(planScan.hasNext())
						{
							planLine = planScan.nextLine();
							p = planLine.split("\t");
							if(p[0].contains("Top Image X:")) topX = Integer.parseInt(p[1]);
							else if(p[0].contains("Top Image Y:")) topY = Integer.parseInt(p[1]);
							else if(p[0].contains("Image Width:")) imgW = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Center (Y/N):")){
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
							else if(p[0].contains("Name Size:")) fontS = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Color:")) color = p[1];
							else if(p[0].contains("Name Font:")) font = p[1];
						}
						planScan.close();
					}
					overlay = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Calendar.png"));
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Calendar Template: "+e);return;}
			}
			
			background = new BufferedImage(3600,2700,BufferedImage.TYPE_INT_RGB);
			bGraphics = background.createGraphics();
			bGraphics.setColor(Color.white);
			bGraphics.drawRect(0, 0, 3600, 2700);
			
			if(loadImage(calendars.get(i)))
			{
				positioner(calendars.get(i).first);
				writeFinal("Calendar"+i+"_"+calendars.get(i).last+"_"+calendars.get(i).first+".jpg");
			}
			background.flush();
			background = null;
			orders.updateProgressBar((i*100)/calendars.size(), "Calendar: "+calendars.get(i).last+", "+calendars.get(i).first);
		}
		overlay.flush();
		overlay = null;
	}
	private void initializeVariables()
	{
		topX =0;
		topY=0;
		imgW=0;
		nameX=0;
		nameY=0;
		maxW=0;
		fontS=0;
		nameC=false;
		nameP=false;
		color="Black";
		font="Arial";
	}
	private void positioner(String firstName)
	{
		bGraphics.drawImage(sImage.getScaledInstance(imgW, -1, Image.SCALE_SMOOTH), topX, topY, null);
		bGraphics.drawImage(overlay, null, 0, 0);
		sImage.flush();
		sImage = null;
		
		if(nameX!=0&&nameY!=0)
		{
			if(nameP) firstName = WordUtils.capitalizeFully(firstName);
			Color fontColor;
			if(color.contains(","))
			{
				String c[] = color.split(",");
				bGraphics.setColor(new Color(Integer.parseInt(c[0]),Integer.parseInt(c[1]),Integer.parseInt(c[2])));
			}
			else
			{
				try {
				    Field field = Class.forName("java.awt.Color").getField(color);
				    fontColor = (Color)field.get(null);
				} catch (Exception e) {
					fontColor = null; // Not defined
				}
				bGraphics.setColor(fontColor);
			}
			activeSize = fontS;
			bGraphics.setFont(new Font(font,Font.PLAIN,activeSize));
			FontMetrics fm = bGraphics.getFontMetrics();
			while(fm.stringWidth(firstName)>maxW)
			{
				activeSize--;
				bGraphics.setFont(new Font(font,Font.PLAIN,activeSize));
				fm = bGraphics.getFontMetrics();
			}
			if(nameC) bGraphics.drawString(firstName, nameX-(fm.stringWidth(firstName)/2), nameY);
			else bGraphics.drawString(firstName, nameX, nameY);
		}
	}
	private boolean loadImage(RenderOrder s)
	{
		try
		{
			sImage = ImageIO.read(new File(s.jobFolder+"\\"+s.imgFolder+"\\"+s.image));
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Image for Calendar: "+e);return false;}
		return true;
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
