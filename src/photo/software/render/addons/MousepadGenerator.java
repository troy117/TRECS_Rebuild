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

import photo.software.render.RenderOrder;
import photo.software.render.RenderOrders;

public class MousepadGenerator 
{
	private ArrayList<RenderOrder> mousepads;
	private String renderpath;
	private RenderOrders orders;
	
	BufferedImage background, overlay, sImage;
	Graphics2D bGraphics, oGraphics, sGraphics,rGraphics,gResult;
	Image resized;
	
	FontMetrics fm;
	int nameSize;
	String plan = "";
	
	File planFile;
	Scanner planScan;
	String planLine;
	String[] p;
	int pngW, pngH,
		topX1, topY1, imgW1, topX2, topY2, imgW2, 
		nameX1, nameY1, maxW1, fontS1, activeSize1;
	boolean nameC1;
	String color1, font1;
	
	public MousepadGenerator(ArrayList<RenderOrder> mousepads, String renderpath, RenderOrders orders)
	{
		this.mousepads = mousepads;
		this.renderpath = renderpath;
		this.orders = orders;
		
		start();
	}
	private void start()
	{
		for(int i=0;i<mousepads.size();i++)
		{
			if((plan.equals(""))||(!plan.equals(mousepads.get(i).plan)))
			{
				plan = mousepads.get(i).plan;
				if(overlay!=null) overlay.flush();
				overlay = null;
				try
				{
					planFile = new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Mousepad.txt");
					if(planFile.exists())
					{
						initializeVariables();
						planScan = new Scanner(planFile);
						while(planScan.hasNext())
						{
							planLine = planScan.nextLine();
							p = planLine.split("\t");
							if(p[0].contains("PNG Width:")) pngW = Integer.parseInt(p[1]);
							else if(p[0].contains("PNG Height:")) pngH = Integer.parseInt(p[1]);
							else if(p[0].contains("Top Image1 X:")) topX1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Top Image1 Y:")) topY1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Image1 Width:")) imgW1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Top Image2 X:")) topX2 = Integer.parseInt(p[1]);
							else if(p[0].contains("Top Image2 Y:")) topY2 = Integer.parseInt(p[1]);
							else if(p[0].contains("Image2 Width:")) imgW2 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Center (Y/N):")){
								if(p[1].contains("Y")) nameC1 = true;
								else nameC1 = false;
							}
							else if(p[0].contains("Name1 Start X:")) nameX1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Bottom Y:")) nameY1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Max Width:")) maxW1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Size:")) fontS1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Color:")) color1 = p[1];
							else if(p[0].contains("Name1 Font:")) font1 = p[1];
						}
						planScan.close();
					}
					overlay = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Mousepad.png"));
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Button Template: "+e);return;}
			}
			
			background = new BufferedImage(pngW,pngH,BufferedImage.TYPE_INT_RGB);
			bGraphics = background.createGraphics();
			bGraphics.setColor(Color.white);
			bGraphics.drawRect(0, 0, pngW, pngH);
			if(loadImage(mousepads.get(i)))
			{
				positioner(mousepads.get(i).first);
				writeFinal(i+"_"+mousepads.get(i).homeroom+"_"+mousepads.get(i).last+"_"+mousepads.get(i).first+".jpg");
			}
			background.flush();
			background = null;
			orders.updateProgressBar((i*100)/mousepads.size(), "Mousepads: "+mousepads.get(i).last+", "+mousepads.get(i).first);
		}
	}
	private void initializeVariables()
	{
		pngW=0;
		pngH=0;
		topX1=0;
		topY1=0;
		imgW1=0;
		topX2=0;
		topY2=0;
		imgW2=0;
		nameX1=0;
		nameY1=0;
		maxW1=0;
		fontS1=0;
		nameC1=false;
		color1="Black";
		font1="Arial";
	}
	private void positioner(String firstName)
	{
		resized = sImage.getScaledInstance(imgW1, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, topX1, topY1, null);
		
		if((imgW1!=imgW2)&&(imgW2!=0)) resized = sImage.getScaledInstance(imgW2, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, topX2, topY2, null);
		bGraphics.drawImage(overlay, null, 0, 0);
		
		sImage.flush();
		resized.flush();
		sImage = null;
		resized = null;
		if(nameX1!=0&&nameY1!=0)
		{
			Color fontColor1;
			if(color1.contains(","))
			{
				String c[] = color1.split(",");
				bGraphics.setColor(new Color(Integer.parseInt(c[0]),Integer.parseInt(c[1]),Integer.parseInt(c[2])));
			}
			else
			{
				try {
				    Field field = Class.forName("java.awt.Color").getField(color1);
				    fontColor1 = (Color)field.get(null);
				} catch (Exception e) {
					fontColor1 = null; // Not defined
				}
				bGraphics.setColor(fontColor1);
			}
			activeSize1 = fontS1;
			bGraphics.setFont(new Font(font1,Font.PLAIN,activeSize1));
			FontMetrics fm = bGraphics.getFontMetrics();
			while(fm.stringWidth(firstName)>maxW1)
			{
				activeSize1--;
				bGraphics.setFont(new Font(font1,Font.PLAIN,activeSize1));
				fm = bGraphics.getFontMetrics();
			}
			if(nameC1) bGraphics.drawString(firstName, nameX1-(fm.stringWidth(firstName)/2), nameY1);
			else bGraphics.drawString(firstName, nameX1, nameY1);
		}
	}
	private boolean loadImage(RenderOrder s)
	{
		try
		{
			sImage = ImageIO.read(new File(s.jobFolder+"\\"+s.imgFolder+"\\"+s.image));
		}
		catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Image for Mousepad: "+e);return false;}
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
