package photo.software.event.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

public class RenderEventLabels 
{
	private ArrayList<String> homerooms;
	private String outputPath;
	private BufferedImage bImage, cImage;
	private Graphics2D cG, bG;
	private FontMetrics fm;
	private String schoolName;
	
	public RenderEventLabels(ArrayList<String> homerooms, String output, String schoolName)
	{
		this.homerooms = homerooms;
		this.outputPath = output;
		this.schoolName = schoolName;
		
		try
		{
			bImage = new BufferedImage(2550, 3300, BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0,0,2550,3300);
			cImage = new BufferedImage(1200,600,BufferedImage.TYPE_INT_RGB);
			cG = cImage.createGraphics();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Initializing Label Creator... "+e);}
		startSheet();
		
	}
	private void startSheet()
	{
		int sheet = 1;
		boolean allRendered = false;
		
		try
		{
			for(int i=0;i<homerooms.size();i++)
			{
				allRendered = false;
				prepLabel(homerooms.get(i));
				bG.drawImage(cImage, 56+((i%2)*1238),150+(((i%10)/2)*600),null);
				
				if(i%10==9)
				{
					//Write Cards
					bG.setColor(Color.black);
					bG.setFont(new Font("Arial",Font.PLAIN,25));
					bG.drawString("Label_"+sheet, 2350, 70);
	
					ImageIO.write(bImage,"jpg", new File(outputPath+"\\_labels_"+sheet+".jpg"));
					
					//Write Cards
					bG.setColor(Color.white);
					bG.fillRect(0, 0, 2550, 3300);
					allRendered = true;
					sheet++;
				}
			}
			if(!allRendered)
			{
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,25));
				bG.drawString("Label_"+sheet, 2350, 70);

				ImageIO.write(bImage,"jpg", new File(outputPath+"\\_labels_"+sheet+".jpg"));
				bG.setColor(Color.white);
				bG.fillRect(0, 0, 2550, 3300);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error writing label: "+e+"\nOn Sheet "+sheet);}
	}
	private void prepLabel(String homeroom)
	{
		cG.setColor(Color.white);
		cG.fillRect(0,0,1200,600);
		cG.setColor(Color.black);
		
		int tempSize = 200;
		cG.setFont(new Font("Arial", Font.PLAIN,tempSize));
		fm = cG.getFontMetrics();
		int width = fm.stringWidth(homeroom);
		
		while(width>1100)
		{
			tempSize = tempSize-2;
			cG.setFont(new Font("Arial",Font.PLAIN,tempSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(homeroom);
		}
		cG.drawString(homeroom, 50, 300);
		
		tempSize = 50;
		cG.setFont(new Font("Arial",Font.PLAIN,tempSize));
		width = fm.stringWidth(schoolName);
		
		while(width>1100)
		{
			tempSize = tempSize-2;
			cG.setFont(new Font("Arial",Font.PLAIN,tempSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(schoolName);
		}
		cG.drawString(schoolName, 50, 450);
	}
}
