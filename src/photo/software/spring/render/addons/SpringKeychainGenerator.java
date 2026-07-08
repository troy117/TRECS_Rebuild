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

public class SpringKeychainGenerator 
{
	private ArrayList<SpringStudent> keychains;
	private String renderpath, schoolpath;
	private RenderSpringOrderGUI gui;
	
	private BufferedImage background, stuImage, overlay;
	private Graphics2D bGraphics;
	
	private Color springColor = new Color(7,88,68);
	private int nameSize;
	private FontMetrics fm;
	
	public SpringKeychainGenerator(ArrayList<SpringStudent> keychains, String schoolpath, String renderpath, RenderSpringOrderGUI gui)
	{
		this.keychains = keychains;
		this.schoolpath = schoolpath;
		this.renderpath = renderpath;
		this.gui = gui;
		
		start();
	}
	private void start()
	{
		if(keychains.size()>0)
		{
			try
			{
				overlay = ImageIO.read(new File("Templates\\Spring\\Keychain_Spring.png"));
				background = new BufferedImage(1200,863,BufferedImage.TYPE_INT_RGB);
				bGraphics = background.createGraphics();
				
				for(int i=0;i<keychains.size();i++)
				{
					bGraphics.setColor(Color.white);
					bGraphics.drawRect(0, 0, 1200, 863);
					stuImage = ImageIO.read(new File(schoolpath+"\\CroppedLarge\\"+keychains.get(i).img));
					bGraphics.drawImage(stuImage.getScaledInstance(-1,580, Image.SCALE_SMOOTH), 70, 67, null);
					bGraphics.drawImage(stuImage.getScaledInstance(-1,580, Image.SCALE_SMOOTH), 660, 67, null);
					bGraphics.drawImage(overlay, 0, 0, null);
					stuImage.flush();
					stuImage = null;
					
					bGraphics.setColor(springColor);
					nameSize = 65;
					bGraphics.setFont(new Font("the unseen",Font.PLAIN,nameSize));
					fm = bGraphics.getFontMetrics();
					
					while(fm.stringWidth(keychains.get(i).first)>450)
					{
						nameSize--;
						bGraphics.setFont(new Font("the unseen",Font.PLAIN,nameSize));
						fm = bGraphics.getFontMetrics();
					}
					bGraphics.drawString(keychains.get(i).first, (900-(fm.stringWidth(keychains.get(i).first)/2)), 760);
					
					ImageIO.write(background, "jpg", new File(renderpath+"\\"+i+"_"+keychains.get(i).last+"_"+keychains.get(i).first+".jpg"));
					
					gui.updateProgressBar((i*100)/keychains.size(),"Keychains: "+keychains.get(i).last+", "+keychains.get(i).first);
					
				}
				overlay.flush();
				overlay = null;
				background.flush();
				background = null;
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error With Keychain : "+e);return;}
		}
	}

}