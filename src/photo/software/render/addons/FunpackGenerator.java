package photo.software.render.addons;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.render.RenderOrder;
import photo.software.render.RenderOrders;


public class FunpackGenerator 
{
	private ArrayList<RenderOrder> funpacks;
	private String renderpath;
	private RenderOrders orders;
	
	BufferedImage background, overlay, sImage,rImage;
	Graphics2D bGraphics, oGraphics, sGraphics,rGraphics,gResult;
	Image resized;
	
	String plan="";
	
	public FunpackGenerator(ArrayList<RenderOrder> funpacks, String renderpath, RenderOrders orders)
	{
		this.funpacks = funpacks;
		this.renderpath = renderpath;
		this.orders = orders;
		
		start();
	}
	private void start()
	{
		for(int i=0;i<funpacks.size();i++)
		{
			if(plan.equals("")||(!plan.equals(funpacks.get(i).plan)))
			{
				plan = funpacks.get(i).plan;
				if(overlay!=null) overlay.flush();
				overlay = null;
				try
				{
					overlay = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\Funpack.png"));
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Funpack Template: "+e);return;}
			}
			
			background = new BufferedImage(2700,3600,BufferedImage.TYPE_INT_RGB);
			bGraphics = background.createGraphics();
			bGraphics.setColor(Color.white);
			bGraphics.drawRect(0, 0, 2700, 3600);
			
			if(loadImage(funpacks.get(i)))
			{
				positioner(funpacks.get(i));
				writeFinal("Fun_"+String.format("%03d", i)+"_"+funpacks.get(i).last+"_"+funpacks.get(i).first+".jpg");
			}
			
			background.flush();
			background = null;
			orders.updateProgressBar((i*100)/funpacks.size(), "Funpack: "+funpacks.get(i).last+", "+funpacks.get(i).first);
		}
		overlay.flush();
		overlay = null;
		
	}
	private void positioner(RenderOrder s)
	{
		FontMetrics fm;
		resized = sImage.getScaledInstance(400, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, 2130, 2740, null);//ruler
		resized = sImage.getScaledInstance(425, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, 720, 2750, null);//T-shirt
		resized = sImage.getScaledInstance(450, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, 1020, 735, null);//Bookmark
		bGraphics.drawImage(resized, 1590, 735, null);//Bookmark
		resized = sImage.getScaledInstance(500, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, 290, 1050, null);
		resized = sImage.getScaledInstance(240, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, 1380, 3090, null);
		bGraphics.drawImage(resized, 220, 3040, null);
		bGraphics.drawImage(resized, 736, 2215, null);
		resized = sImage.getScaledInstance(280, -1, Image.SCALE_SMOOTH);
		bGraphics.drawImage(resized, 1520, 2447, null);

		bGraphics.drawImage(overlay, null, 0, 0);
		
		sImage.flush();
		resized.flush();
		sImage = null;
		resized = null;
		
		bGraphics.setColor(Color.white);
		bGraphics.fillRect(0, 3350, 580, 160);
		bGraphics.setColor(Color.black);
		bGraphics.setFont(new Font("Arial",Font.PLAIN,30));
		bGraphics.drawString(s.last+", "+s.first, 135, 3385);
		bGraphics.drawString(s.grade+"   "+s.homeroom,135,3415);
		bGraphics.drawString(s.schoolName,135,3445);
		
		bGraphics.setColor(Color.black);
		bGraphics.setFont(new Font("Permanent Marker", Font.PLAIN, 100));
		fm = bGraphics.getFontMetrics();
		int width = fm.stringWidth(s.first);
		int tempSize = 100;
		while (width>560)
		{
			tempSize--;
			bGraphics.setFont(new Font("Space Comics", Font.PLAIN, tempSize));
			fm = bGraphics.getFontMetrics();
			width = fm.stringWidth(s.first);
		}
		bGraphics.drawString(s.first, 540-(width/2), 1020);
		
	}
	private boolean loadImage(RenderOrder s)
	{
		try
		{
			sImage = ImageIO.read(new File(s.jobFolder +"\\"+s.imgFolder+"\\"+s.image));
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading CroppedMed: "+e);return false;}
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
