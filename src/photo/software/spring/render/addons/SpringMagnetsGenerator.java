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

public class SpringMagnetsGenerator 
{
	private ArrayList<SpringStudent> magnets;
	private String renderpath, schoolpath;
	private RenderSpringOrderGUI gui;
	
	private BufferedImage background, stuImage, overlay;
	private Graphics2D bGraphics;
	
	private Color springColor = new Color(7,88,68);
	private int nameSize;
	private FontMetrics fm;
	
	public SpringMagnetsGenerator(ArrayList<SpringStudent> magnets, String schoolpath, String renderpath, RenderSpringOrderGUI gui)
	{
		this.magnets = magnets;
		this.schoolpath = schoolpath;
		this.renderpath = renderpath;
		this.gui = gui;
		
		start();
	}
	private void start()
	{
		if(magnets.size()>0)
		{
			try
			{
				overlay = ImageIO.read(new File("Templates\\Spring\\5x7 Magnets_Spring.png"));
				background = new BufferedImage(1500,2100,BufferedImage.TYPE_INT_RGB);
				bGraphics = background.createGraphics();
				
				for(int i=0;i<magnets.size();i++)
				{
					bGraphics.setColor(Color.white);
					bGraphics.drawRect(0, 0, 1500, 2100);
					stuImage = ImageIO.read(new File(schoolpath+"\\CroppedLarge\\"+magnets.get(i).img));
					bGraphics.drawImage(stuImage.getScaledInstance(-1,1625, Image.SCALE_SMOOTH), 95, 95, null);
					bGraphics.drawImage(overlay, 0, 0, null);
					stuImage.flush();
					stuImage = null;
					
					bGraphics.setColor(springColor);
					nameSize = 140;
					bGraphics.setFont(new Font("the unseen",Font.PLAIN,nameSize));
					fm = bGraphics.getFontMetrics();
					
					while(fm.stringWidth(magnets.get(i).first)>1300)
					{
						nameSize--;
						bGraphics.setFont(new Font("the unseen",Font.PLAIN,nameSize));
						fm = bGraphics.getFontMetrics();
					}
					bGraphics.drawString(magnets.get(i).first, (750-(fm.stringWidth(magnets.get(i).first)/2)), 1870);
					
					ImageIO.write(background, "jpg", new File(renderpath+"\\"+i+"_"+magnets.get(i).last+"_"+magnets.get(i).first+".jpg"));
					
					gui.updateProgressBar((i*100)/magnets.size(),"Magnets: "+magnets.get(i).last+", "+magnets.get(i).first);
					
				}
				overlay.flush();
				overlay = null;
				background.flush();
				background = null;
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error With Magnets : "+e);return;}
		}
	}

}