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
import java.util.Hashtable;
import java.util.Scanner;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import photo.software.render.RenderOrder;
import photo.software.render.RenderOrders;

public class QRCodeGenerator 
{
	private ArrayList<RenderOrder> qrCodes;
	private String renderpath, job;
	private RenderOrders orders;
	
	BufferedImage background, overlay, sImage;
	Graphics2D bGraphics;
	Graphics2D oGraphics;
	Graphics2D sGraphics;
	Graphics2D rGraphics;
	Graphics2D gResult;
	String plan="";
	Image resized;
	File planFile;
	Scanner planScan;
	String planLine;
	String[] p;
	int topX, topY, imgW, nameX, nameY, maxW, fontS, activeSize;
	boolean nameC;
	String color, font;
	public static char enc[] = {'0','1','2','3','4','5','6','7','8','9'};
	public static char dec[] = {'X','G','P','B','A','L','R','C','F','H'};
	
	
	public QRCodeGenerator(ArrayList<RenderOrder> qrCodes, String renderpath, RenderOrders orders, String job)
	{
		this.qrCodes = qrCodes;
		this.renderpath = renderpath;
		this.job = job;
		this.orders = orders;
		
		start();
	}
	private String doEncryption(String s)
	{
        char c[] = new char[(s.length())];
        for (int i = 0; i < s.length(); i++)
        {
            for (int j = 0; j < 26; j++)
            {
                if (enc[j] == s.charAt(i))
                {
                    c[i] = dec[j];
                    break;
                }
            }
        }
        return (new String(c));
	}
	private void start()
	{
		String link="";
		for(int i=0;i<qrCodes.size();i++)
		{
			if(plan.equals("")||(!plan.equals(qrCodes.get(i).plan)))
			{
				plan = qrCodes.get(i).plan;
				if(overlay!=null) overlay.flush();
				overlay = null;
				try
				{
					planFile = new File("Templates\\PACKAGE_PLANS\\"+plan+"\\qrCode.txt");
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
							else if(p[0].contains("Name Start X:")) nameX = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Bottom Y:")) nameY = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Max Width:")) maxW = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Size:")) fontS = Integer.parseInt(p[1]);
							else if(p[0].contains("Name Color:")) color = p[1];
							else if(p[0].contains("Name Font:")) font = p[1];
						}
						planScan.close();
					}
					overlay = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\QRcode.png"));
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading QRcode Template: "+e);return;}
			}

			background = new BufferedImage(1200,1800,BufferedImage.TYPE_INT_RGB);
			bGraphics = background.createGraphics();
			bGraphics.setColor(Color.white);
			bGraphics.drawRect(0, 0, 1200, 1800);

			if(loadImage(qrCodes.get(i)))
			{
				positioner(qrCodes.get(i));
				bGraphics.drawImage(createQRImage("http://download.islandphotography.net/"+job+'/'+doEncryption(qrCodes.get(i).ref)+".jpg",300), 225, 1400, null);
				bGraphics.setFont(new Font("Arial",Font.PLAIN,30));
				bGraphics.setColor(Color.black);
				link = "http://download.islandphotography.net/"+job+'/'+doEncryption(qrCodes.get(i).ref)+".jpg";
				FontMetrics fm = bGraphics.getFontMetrics();
				
				bGraphics.drawString(link, 600-(fm.stringWidth(link)/2), 1300);
				writeFinal("QRcode"+i+"_"+qrCodes.get(i).last+"_"+qrCodes.get(i).first+".jpg");
			}
			background.flush();
			background = null;
			orders.updateProgressBar((i*100)/qrCodes.size(), "QRcode: "+qrCodes.get(i).last+", "+qrCodes.get(i).first);
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
		color="Black";
		font="Arial";
	}
	@SuppressWarnings("unchecked")
	private static BufferedImage createQRImage(String qrCodeText, int size) {
		
		BufferedImage image = null;
		try {
			// Create the ByteMatrix for the QR-Code that encodes the given String
			@SuppressWarnings("rawtypes")
			Hashtable hintMap = new Hashtable();
			hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
			QRCodeWriter qrCodeWriter = new QRCodeWriter();
			BitMatrix byteMatrix;
	
				byteMatrix = qrCodeWriter.encode(qrCodeText,
						BarcodeFormat.QR_CODE, size, size, hintMap);
	
			// Make the BufferedImage that are to hold the QRCode
			int matrixWidth = byteMatrix.getWidth();
			image = new BufferedImage(matrixWidth, matrixWidth,
					BufferedImage.TYPE_INT_RGB);
			image.createGraphics();
	
			Graphics2D graphics = (Graphics2D) image.getGraphics();
			graphics.setColor(Color.WHITE);
			graphics.fillRect(0, 0, matrixWidth, matrixWidth);
			// Paint and save the image using the ByteMatrix
			graphics.setColor(Color.BLACK);
	
			for (int i = 0; i < matrixWidth; i++) {
				for (int j = 0; j < matrixWidth; j++) {
					if (byteMatrix.get(i, j)) {
						graphics.fillRect(i, j, 1, 1);
					}
				}
			}
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return image;
	}

	private void positioner(RenderOrder student)
	{
		String name = student.first+" "+student.last;
		bGraphics.drawImage(sImage.getScaledInstance(imgW, -1, Image.SCALE_SMOOTH), topX, topY, null);
		bGraphics.drawImage(overlay, null, 0, 0);
		sImage.flush();
		sImage = null;
		if(nameX!=0&&nameY!=0)
		{
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
			while(fm.stringWidth(name)>maxW)
			{
				activeSize--;
				bGraphics.setFont(new Font(font,Font.PLAIN,activeSize));
				fm = bGraphics.getFontMetrics();
			}
			if(nameC) bGraphics.drawString(name, nameX-(fm.stringWidth(name)/2), nameY);
			else bGraphics.drawString(name, nameX, nameY);
			name = student.homeroom;
			activeSize = fontS-10;
			bGraphics.setFont(new Font(font,Font.PLAIN,activeSize));
			fm = bGraphics.getFontMetrics();
			while(fm.stringWidth(name)>maxW)
			{
				activeSize--;
				bGraphics.setFont(new Font(font,Font.PLAIN,activeSize));
				fm = bGraphics.getFontMetrics();
			}
			if(nameC) bGraphics.drawString(name, nameX-(fm.stringWidth(name)/2), nameY+50);
			else bGraphics.drawString(name, nameX, nameY+50);
			name = student.homeroom;
		}
		

	}
	private boolean loadImage(RenderOrder s)
	{
		ArrayList<String> borders = new ArrayList<String>();
		try
		{

			File cd_borders = new File("TEMPLATES\\CD_Borders.txt");
			String border_line;
			if(cd_borders.exists())
			{
				Scanner cd_borderScanner = new Scanner(cd_borders);
				while(cd_borderScanner.hasNext())
				{
					border_line = cd_borderScanner.nextLine();
					if(!border_line.contains("\\\\")) borders.add(border_line);
					
				}
				cd_borderScanner.close();
			}else JOptionPane.showMessageDialog(null, "CD_Borders.txt File does not exist!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH CD_Borders FILE!");}
		
		
		boolean found = false;
		try
		{
			System.out.println(s.imgFolder+"\\"+s.image);
			File temp = new File(s.imgFolder+"\\" + s.image);
			sImage = ImageIO.read(new File(s.imgFolder+"\\" + s.image));
			for(String border: borders)
			{
				temp = new File(s.jobFolder+"\\Borders\\"+border+"\\"+s.image);
				if(temp.exists()) {
					sImage = ImageIO.read(temp);
					found = true;
					break;
				}
			}
			if(!found) FileUtils.copyFile(new File(s.imgFolder+"\\"+s.image), 
					new File(renderpath+"\\ENC\\"+doEncryption(s.ref)+".jpg"));
			else FileUtils.copyFile(temp, 
					new File(renderpath+"\\ENC\\"+doEncryption(s.ref)+".jpg"));
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Student Image: "+e);}
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
