package photo.software.admin;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.student.Student;



public class StickerBuilder 
{
	private ArrayList<Student> renderList;
	private String imagesPath,outputPath;
	
	private BufferedImage img, sticker, bImage;
	private Graphics2D g, bG;
	private int count,position;
	private Boolean concatH,concatG, allRendered;
	
	private Student currentStudent;
	private int[] col={56,468,881,1293,1706,2118};
	private int[] row={150,652,1155,1657,2160,2662};
	
	public StickerBuilder(ArrayList<Student> renderList,String imagesPath,String outputPath,Boolean concatH, Boolean concatG)
	{
		this.renderList=renderList;
		this.imagesPath=imagesPath;
		this.outputPath=outputPath;
		this.concatH=concatH;
		this.concatG=concatG;
		count = 1;
		currentStudent = new Student();
	}
	
	public void beginProcess()
	{
		try
		{
			bImage = new BufferedImage(2550,3300,BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			position=0;
			for(int i=0;i<renderList.size();i++)
			{
				allRendered=false;
				if(!renderList.get(i).ref.equals(currentStudent.ref))
				{
					
					if(concatH&&(!renderList.get(i).homeroom.equals(currentStudent.homeroom))&&(i!=0))
					{
						renderPage();
					}
					if(concatG&&(!renderList.get(i).grade.equals(currentStudent.grade))&&(i!=0))
					{
						renderPage();
					}
					createSticker(renderList.get(i));
				
				}
				currentStudent=renderList.get(i);
				writeToPage(position);
				position++;
				if(position==36) renderPage();
				
			}
			if(!allRendered) renderPage();
		}catch(Exception e){System.out.println("Error Proccessing: "+e);}
	}
	private void createSticker(Student s)
	{
		try
		{
			sticker = new BufferedImage(375,489,BufferedImage.TYPE_INT_RGB);
			g = sticker.createGraphics();
			g.setColor(Color.white);
			g.fillRect(0, 0, 375, 489);
			g.setFont(new Font("Arial", Font.PLAIN,16));
			g.setColor(Color.black);
			g.drawString(s.last, 50, 420);
			g.drawString(s.first+"   "+s.grade,50,438);
			g.drawString(s.homeroom+"  "+s.ID, 50, 465);
			g.setColor(Color.white);
			
			img = ImageIO.read(new File(imagesPath+"\\"+s.ref+".jpg"));
			
			g.drawImage(img.getScaledInstance(300, -1, Image.SCALE_SMOOTH), 27, 0, null);
			
		}catch(Exception e){System.out.println("Error opening student: "+e+"\n"+s.ref);}
	}
	
	private void renderPage() throws IOException
	{
		bG.setColor(Color.black);
		bG.setFont(new Font("Arial",Font.PLAIN,30));
		bG.drawString("Page: "+count, 100, 100);
		ImageIO.write(bImage, "jpg", new File(outputPath+"\\Stickers_"+count+".jpg"));
		count++;
		allRendered=true;
		bG.setColor(Color.white);
		bG.fillRect(0, 0, 2550, 3300);
		position=0;
	}
	
	private void writeToPage(int index)
	{
		try
		{
			bG.drawImage(sticker, col[(index%6)], row[index/6], null);
		}
		catch(Exception e){JOptionPane.showMessageDialog(null,"Error filling sticker page: "+e);}
	}
	
}
