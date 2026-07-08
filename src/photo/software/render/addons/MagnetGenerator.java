package photo.software.render.addons;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.geom.AffineTransform;
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

public class MagnetGenerator 
{
	private ArrayList<RenderOrder> magnets;
	private String  renderpath;
	private RenderOrders orders;
	
	BufferedImage background, overlay1,overlay2, sImage, tImage;
	Graphics2D bGraphics, oGraphics, sGraphics,rGraphics,gResult;
	Image resized;
	
	Color elemColor = new Color(103,177,250);
	FontMetrics fm;
	int nameSize, count,totalMagnets = 0;
	String plan = "";
	
	File planFile;
	Scanner planScan;
	String planLine;
	String[] p;
	int pngW, pngH,
		topX1, topY1, imgW1, topX2, topY2, imgW2, 
		nameX1, nameY1, maxW1, fontS1, activeSize1,
		nameX2, nameY2, maxW2, fontS2, activeSize2,
		stuInfoX, stuInfoY, stuInfoSize;
	boolean nameC1, nameC2, nameP1, nameP2, stuInfoR, stuInfo;
	String color1, font1, color2, font2;
	int stackCut = 0;
	
	public MagnetGenerator(ArrayList<RenderOrder> magnets, String renderpath, RenderOrders orders)
	{
		this.magnets = magnets;
		this.renderpath = renderpath;
		this.orders = orders;
		
		start();
	}
	public int getStackCut()
	{
		return stackCut;
	}
	private void start()
	{
		count = 0;
		boolean twoMagnets = false;
		for(int i=0;i<magnets.size();i++)
		{
			if(plan.equals("")||(!plan.equals(magnets.get(i).plan)))
			{
				plan = magnets.get(i).plan;
				if(overlay1!=null) overlay1.flush();
				overlay1 = null;
				if(overlay2!=null) overlay2.flush();
				overlay2 = null;
				try
				{
					planFile = new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Magnet.txt");
					if(planFile.exists())
					{
						initializeVariables();
						planScan = new Scanner(planFile);
						while(planScan.hasNext())
						{
							planLine = planScan.nextLine();
							p = planLine.split("\t");
							if (p[0].contains("Two Magnets (Y/N):")){
								if(p[1].contains("Y")) twoMagnets = true;
								else twoMagnets = false;
							}
							else if(p[0].contains("Stack Cut:")) stackCut = Integer.parseInt(p[1]);
							else if(p[0].contains("PNG Width:")) pngW = Integer.parseInt(p[1]);
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
							else if(p[0].contains("Name1 Proper (Y/N):")){
								if(p[1].contains("Y")) nameP1 = true;
								else nameP1 = false;
							}
							else if(p[0].contains("Name1 Start X:")) nameX1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Bottom Y:")) nameY1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Max Width:")) maxW1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Size:")) fontS1 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name1 Color:")) color1 = p[1];
							else if(p[0].contains("Name1 Font:")) font1 = p[1];
							else if(p[0].contains("Name2 Center (Y/N):")){
								if(p[1].contains("Y")) nameC2 = true;
								else nameC2 = false;
							}
							else if(p[0].contains("Name2 Proper (Y/N):")){
								if(p[1].contains("Y")) nameP2 = true;
								else nameP2 = false;
							}
							else if(p[0].contains("Name2 Start X:")) nameX2 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name2 Bottom Y:")) nameY2 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name2 Max Width:")) maxW2 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name2 Size:")) fontS2 = Integer.parseInt(p[1]);
							else if(p[0].contains("Name2 Color:")) color2 = p[1];
							else if(p[0].contains("Name2 Font:")) font2 = p[1];
							
							else if(p[0].contains("StudentInfo (Y/N):")){
								if(p[1].contains("Y")) stuInfo = true;
								else stuInfo = false;
							}
							else if(p[0].contains("StudentInfoRotate (Y/N):")){
								if(p[1].contains("Y")) stuInfoR = true;
								else stuInfoR = false;
							}
							else if(p[0].contains("StudentInfo X:")) stuInfoX = Integer.parseInt(p[1]);
							else if(p[0].contains("StudentInfo Y:")) stuInfoY = Integer.parseInt(p[1]);
							else if(p[0].contains("StudentInfo Size:")) stuInfoSize = Integer.parseInt(p[1]);
						}
						planScan.close();
					}
					overlay1 = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Magnet1.png"));
					if(twoMagnets) overlay2 = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Magnet2.png"));
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Magnet Template: "+e);return;}
			}
			
			background = new BufferedImage(pngW,pngH,BufferedImage.TYPE_INT_RGB);
			bGraphics = background.createGraphics();
			bGraphics.setColor(Color.white);
			bGraphics.drawRect(0, 0, pngW, pngH);
			if(loadImage(magnets.get(i)))
			{
				if(twoMagnets)
				{
					positioner1(magnets.get(i));
					writeFinal(String.format("%03d", i)+"_"+magnets.get(i).homeroom+"_"+magnets.get(i).last+"_"+magnets.get(i).first+"_1.jpg");
					totalMagnets++;
					positioner2(magnets.get(i));
					writeFinal(String.format("%03d", i)+"_"+magnets.get(i).homeroom+"_"+magnets.get(i).last+"_"+magnets.get(i).first+"_2.jpg");
					totalMagnets++;
				}
				else
				{
					positioner1(magnets.get(i));
					writeFinal(String.format("%03d", i)+"_"+magnets.get(i).homeroom+"_"+magnets.get(i).last+"_"+magnets.get(i).first+".jpg");
					totalMagnets++;
				}
				
			}
			count++;
			background.flush();
			background = null;
			orders.updateProgressBar((i*100)/magnets.size(), "Magnets: "+magnets.get(i).last+", "+magnets.get(i).first);
		}
		
		if(totalMagnets%stackCut!=0)
		{
			int i=magnets.size();
			background = new BufferedImage(pngW,pngH,BufferedImage.TYPE_INT_RGB);
			bGraphics = background.createGraphics();
			bGraphics.setColor(Color.white);
			bGraphics.drawRect(0, 0, pngW, pngH);
			while(totalMagnets%stackCut!=0)
			{
				writeFinal(String.format("%03d", i)+"__Blank.jpg");
				totalMagnets++;
				i++;
			}
			background.flush();
			background = null;
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
		nameP1=false;
		color1="Black";
		font1="Arial";
		nameX2=0;
		nameY2=0;
		maxW2=0;
		fontS2=0;
		nameC2=false;
		nameP2=false;
		color2="Black";
		font2="Arial";
		stuInfo=false;
		stuInfoX=0;
		stuInfoY=0;
		stuInfoSize=0;
	}

	private void positioner1(RenderOrder magnet)
	{
		String firstName = magnet.first;
		if(nameP1) firstName = WordUtils.capitalizeFully(firstName);
		resized = sImage.getScaledInstance(imgW1, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, topX1, topY1, null);
		bGraphics.drawImage(overlay1, null, 0, 0);
		
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
		if(stuInfoX!=0&&stuInfoY!=0)
		{
			bGraphics.setFont(new Font("Arial",Font.PLAIN,stuInfoSize));
			bGraphics.setColor(Color.black);
			if(stuInfoR)
			{
				AffineTransform orig = bGraphics.getTransform();
				bGraphics.rotate(-Math.PI/2);
				bGraphics.drawString(magnet.grade+" "+magnet.homeroom+":  "+magnet.last+", "+magnet.first, stuInfoX, stuInfoY);
				bGraphics.setTransform(orig);
			}
			else bGraphics.drawString(magnet.grade+" "+magnet.homeroom+":  "+magnet.last+", "+magnet.first, stuInfoX, stuInfoY);
		}
	}
	private void positioner2(RenderOrder magnet)
	{
		String firstName = magnet.first;
		if(nameP2) firstName = WordUtils.capitalizeFully(firstName);
		if((imgW1!=imgW2)&&(imgW2!=0)) resized = sImage.getScaledInstance(imgW2, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, topX2, topY2, null);
		bGraphics.drawImage(overlay2, null, 0, 0);
		
		sImage.flush();
		resized.flush();
		sImage = null;
		resized = null;
		
		if(nameX2!=0&&nameY2!=0)
		{
			Color fontColor2;
			if(color2.contains(","))
			{
				String c[] = color2.split(",");
				bGraphics.setColor(new Color(Integer.parseInt(c[0]),Integer.parseInt(c[1]),Integer.parseInt(c[2])));
			}
			else
			{
				try {
				    Field field = Class.forName("java.awt.Color").getField(color2);
				    fontColor2 = (Color)field.get(null);
				} catch (Exception e) {
					fontColor2 = null; // Not defined
				}
				bGraphics.setColor(fontColor2);
			}
			activeSize2 = fontS2;
			bGraphics.setFont(new Font(font2,Font.PLAIN,activeSize2));
			FontMetrics fm = bGraphics.getFontMetrics();
			while(fm.stringWidth(firstName)>maxW2)
			{
				activeSize2--;
				bGraphics.setFont(new Font(font2,Font.PLAIN,activeSize2));
				fm = bGraphics.getFontMetrics();
			}
			if(nameC2) bGraphics.drawString(firstName, nameX2-(fm.stringWidth(firstName)/2), nameY2);
			else bGraphics.drawString(firstName, nameX2, nameY2);
		}
		if(stuInfoX!=0&&stuInfoY!=0)
		{
			bGraphics.setFont(new Font("Arial",Font.PLAIN,stuInfoSize));
			bGraphics.setColor(Color.black);
			if(stuInfoR)
			{
				AffineTransform orig = bGraphics.getTransform();
				bGraphics.rotate(-Math.PI/2);
				bGraphics.drawString(magnet.grade+" "+magnet.homeroom+":  "+magnet.last+", "+magnet.first, stuInfoX, stuInfoY);
				bGraphics.setTransform(orig);
			}
			else bGraphics.drawString(magnet.grade+" "+magnet.homeroom+":  "+magnet.last+", "+magnet.first, stuInfoX, stuInfoY);
		}
	}

	private boolean loadImage(RenderOrder s)
	{
		try
		{
			sImage = ImageIO.read(new File(s.jobFolder+"\\"+s.imgFolder+"\\"+s.image));
		}
		catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Image for Magnet: "+e);return false;}
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
