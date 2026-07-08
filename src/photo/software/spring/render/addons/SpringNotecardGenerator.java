package photo.software.spring.render.addons;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;




import photo.software.spring.SpringStudent;
import photo.software.spring.render.RenderSpringOrderGUI;

public class SpringNotecardGenerator 
{
	private ArrayList<SpringStudent> notecards;
	private String renderpath, schoolpath;
	private RenderSpringOrderGUI gui;
	
	private BufferedImage background, stuImage, overlay;
	private Graphics2D bGraphics;
	
	private Color springColor = new Color(7,88,68);
	private int nameSize;
	private FontMetrics fm;
	
	public SpringNotecardGenerator(ArrayList<SpringStudent> notecards, String schoolpath, String renderpath, RenderSpringOrderGUI gui)
	{
		this.notecards = notecards;
		this.schoolpath = schoolpath;
		this.renderpath = renderpath;
		this.gui = gui;
		
		start();
	}
	private void start()
	{
		if(notecards.size()>0)
		{
			try
			{
				overlay = ImageIO.read(new File("Templates\\Spring\\4x6 Notecard_Spring.png"));
				background = new BufferedImage(2400,1800,BufferedImage.TYPE_INT_RGB);
				bGraphics = background.createGraphics();
				
				for(int i=0;i<notecards.size();i++)
				{
					bGraphics.setColor(Color.white);
					bGraphics.drawRect(0, 0, 2400, 1800);
					stuImage = ImageIO.read(new File(schoolpath+"\\CroppedLarge\\"+notecards.get(i).img));
					bGraphics.drawImage(stuImage.getScaledInstance(-1,1315, Image.SCALE_SMOOTH), 1275, 120, null);
					bGraphics.drawImage(overlay, 0, 0, null);
					stuImage.flush();
					stuImage = null;
					
					bGraphics.setColor(springColor);
					nameSize = 140;
					bGraphics.setFont(new Font("the unseen",Font.PLAIN,nameSize));
					fm = bGraphics.getFontMetrics();
					
					while(fm.stringWidth(notecards.get(i).first)>850)
					{
						nameSize--;
						bGraphics.setFont(new Font("the unseen",Font.PLAIN,nameSize));
						fm = bGraphics.getFontMetrics();
					}
					bGraphics.drawString(notecards.get(i).first, (1800-(fm.stringWidth(notecards.get(i).first)/2)), 1500);
					
					ImageIO.write(background, "jpg", new File(renderpath+"\\"+i+"_1_"+notecards.get(i).last+"_"+notecards.get(i).first+".jpg"));
					ImageIO.write(background, "jpg", new File(renderpath+"\\"+i+"_2_"+notecards.get(i).last+"_"+notecards.get(i).first+".jpg"));
					
					gui.updateProgressBar((i*100)/notecards.size(),"Notecards: "+notecards.get(i).last+", "+notecards.get(i).first);
					
				}
				gui.updateProgressBar(100,"Notecards: Complete!");
				overlay.flush();
				overlay = null;
				background.flush();
				background = null;
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error With Notecards : "+e);return;}
		}
	}

}