package photo.software.QRevent.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.QRevent.QREventGUI;
import photo.software.QRevent.QRstudent;
import photo.software.comparators.QREventHomeroomSortComparator;
import photo.software.comparators.QREventImageNumberSortComparator;
import photo.software.comparators.QREventReferenceSortComparator;

import photo.software.login.JobData;

public class RenderQREvent implements Runnable
{
	private ArrayList<QRstudent> students;
	private String schoolPath;
	private String outputPath, schoolName;
	private QRRenderGUI render;
	private boolean error = false, horizontal = false, overlays = false;
	private BufferedImage cImage,overlayH,overlayV;
	private Graphics2D cG, gResult;
	private JobData job;
	private int plan;
	private boolean renderLabels,includeIsland,download;
	
	public RenderQREvent(QREventGUI gui, ArrayList<QRstudent> students, String schoolPath, 
			String outputPath,int plan, int sort, QRRenderGUI render, boolean renderLabels, boolean includeIsland, boolean download)
	{
		this.students = students;
		this.job = gui.job;
		this.schoolName = gui.schoolName;
		this.schoolPath = schoolPath;
		this.outputPath = outputPath;
		this.renderLabels = renderLabels;
		this.includeIsland = includeIsland;
		if(sort==1)Collections.sort(students, new QREventReferenceSortComparator());
		else if(sort==2)Collections.sort(students, new QREventImageNumberSortComparator());
		else if(sort==3)Collections.sort(students, new QREventHomeroomSortComparator());
		this.plan = plan;
		this.render = render;
		this.download = download;
		File overlayH_File = new File(schoolPath+"\\Templates\\Horizontal.png");
		File overlayV_File = new File(schoolPath+"\\Templates\\Vertical.png");
		if(overlayH_File.exists()&&overlayV_File.exists())
		{
			overlays = true;
			try
			{
				overlayH = ImageIO.read(overlayH_File);
				overlayV = ImageIO.read(overlayV_File);
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Unable to open overlays..."+e);}
		}
	}
	public void run()
	{
		try
		{
			error = false;
			processImages();

			if(renderLabels)
			{
				ArrayList<String> homeroomNames = new ArrayList<String>();
				for(QRstudent s:students)
				{
					if(!homeroomNames.contains(s.homeroom)) homeroomNames.add(s.homeroom);
				}
				new RenderEventLabels(homeroomNames,outputPath,schoolName);
			}
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Card Creator: "+e);}
		
	}
	private ArrayList<QRstudent> createRenderList()
	{
		ArrayList<QRstudent> renderStudents = new ArrayList<QRstudent>();
		
		int orders = 0;
		for(QRstudent s:students)
		{
			if(plan==2)	//This is the dance package plan
			{
				if(s.order.contains("."))
				{
					String[] t = s.order.split("\\.");
					for(String o:t)
					{
						if(o.equals("1")) renderStudents.add(new QRstudent(s,"Package A"));
						else if(o.equals("2")) renderStudents.add(new QRstudent(s,"Package B"));
					}
				}
				else if(s.order.equals("1")) renderStudents.add(new QRstudent(s,"Package A"));
				else if(s.order.equals("2")) renderStudents.add(new QRstudent(s,"Package B"));
			}
			else	//This is for the 5x7 and wallet count
			{
				try	{orders = Integer.parseInt(s.order);}catch(NumberFormatException e){orders = 0;}
				for(int i = 0;i<orders;i++) renderStudents.add(new QRstudent(s,(i+1)+" of "+orders));
			}
		}
		return renderStudents;
	}

	private void processImages()
	{
		
		ArrayList<QRstudent> renderStudents = createRenderList();
		ArrayList<File> outputFiles = new ArrayList<File>();
		int count = 0, i=0;
		File f;
		for(QRstudent s:renderStudents)
		{
			if(Thread.currentThread().isInterrupted()) return;
			try
			{	
				cImage = new BufferedImage(1650, 2400, BufferedImage.TYPE_INT_RGB);
				cG = cImage.createGraphics();
				cG.setColor(Color.white);
				cG.fillRect(0, 0, 1650, 2400);
				
				if(plan==0)			//5x7 count plan
				{
					create5x7Image(s,count);
					f = new File(outputPath+"\\"+job.job+"_"+String.format("%05d", count)+".jpg");
					ImageIO.write(cImage, "jpg", f);
					outputFiles.add(f);
					render.updateProgressBar((count*100)/renderStudents.size());
				}
				else if(plan==1)	//Wallet count plan
				{
					createStudentWalletImage(s,count);
					f = new File(outputPath+"\\"+job.job+"_"+String.format("%05d", count)+".jpg");
					ImageIO.write(cImage, "jpg", f);
					outputFiles.add(f);
					render.updateProgressBar((count*100)/renderStudents.size());
				}
				else if(s.order.equals("Package A"))	//Dance Plan
				{
					create5x7Image(s,count);
					f = new File(outputPath+"\\"+job.job+"_"+String.format("%05d", count)+".jpg");
					ImageIO.write(cImage, "jpg", f);
					outputFiles.add(f);
					count++;
					f = new File(outputPath+"\\"+job.job+"_"+String.format("%05d", count)+".jpg");
					ImageIO.write(cImage, "jpg", f);
					outputFiles.add(f);
					render.updateProgressBar((i*100)/renderStudents.size());
				}
				else if(s.order.equals("Package B"))	//Dance Plan
				{
					create5x7Image(s,count);
					f = new File(outputPath+"\\"+job.job+"_"+String.format("%05d", count)+".jpg");
					ImageIO.write(cImage, "jpg", f);
					outputFiles.add(f);
					count++;
					createStudentWalletImage(s,count);
					f = new File(outputPath+"\\"+job.job+"_"+String.format("%05d", count)+".jpg");
					ImageIO.write(cImage, "jpg", f);
					outputFiles.add(f);
					render.updateProgressBar((i*100)/renderStudents.size());
				}
				
				cImage.flush();
				cImage = null;
				count++;
				i++;
			}catch(Exception e){render.printText("Error: "+s.ref+" "+e);error = true;}
		}
		stackCutter(outputFiles);
		render.updateProgressBar(100);
		if(error) JOptionPane.showMessageDialog(null, "There was an error, check log.");
	}

	private void create5x7Image(QRstudent s, int count)
	{
		try
		{
			cG.setColor(Color.white);
			cG.fillRect(0, 0, 1650,2400);
			File stuFile = new File(schoolPath+"\\Images\\"+s.image);
			if(stuFile.exists())
			{
				BufferedImage stuImg = ImageIO.read(stuFile);
				int width, height;
				
				width = stuImg.getWidth();
				height = stuImg.getHeight();
				horizontal = false;
				if((double)stuImg.getWidth()>(double)stuImg.getHeight())
				{
					stuImg = rotate(stuImg);
					horizontal = true;
				}
				width = stuImg.getWidth();
				height = stuImg.getHeight();
				
				if(width==1650&&height==2250) cG.drawImage(stuImg, 0, 0, null);
				else	//Will need to program more features, such as rendering 1.5 aspect ratio pictures directly from camera.
				{
					cG.drawImage(resize(stuImg,1500,2250),74,0,null);
					if(overlays)
					{
						if(horizontal) cG.drawImage(overlayH,0,0,null);
						else cG.drawImage(overlayV, 0, 0, null);
					}
				}
				stuImg.flush();
			
			}
			cG.setColor(Color.white);
			cG.fillRect(0, 2175, 1650, 225);
			cG.setColor(Color.black);
			cG.setFont(new Font("Arial",Font.PLAIN,40));
			if(download)
			{
				cG.drawString("Download from download.islandphotography.net/"+s.rand+".jpg", 150, 2225);
				cG.drawString(s.ref+":  "+s.homeroom+": "+s.last+", "+s.first, 150, 2270);
			}
			else
			{
				cG.drawString(s.ref+":  "+s.image+"   Count: "+s.order, 150, 2225);
				cG.drawString(s.homeroom+": "+s.last+", "+s.first, 150, 2270);
			}
			cG.setFont(new Font("Arial",Font.PLAIN,30));
			cG.drawString((1+count)+"", 60, 2380);
			if(includeIsland) cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 150,2305);
			
		}catch(Exception e){render.printText("Error: "+s.ref+" "+e);error = true;}
	}
	
	private void createStudentWalletImage(QRstudent s, int count)
	{
		try
		{
			cG.setColor(Color.white);
			cG.fillRect(0, 0, 1650,2400);
			File stuFile = new File(schoolPath+"\\Images\\"+s.image);
			if(stuFile.exists())
			{
				BufferedImage stuImg = ImageIO.read(stuFile);
				BufferedImage tempImg;
				int width, height;
				
				width = stuImg.getWidth();
				height = stuImg.getHeight();
				horizontal = false;
				if((double)stuImg.getWidth()>(double)stuImg.getHeight())
				{
					stuImg = rotate(stuImg);
					horizontal = true;
				}
				width = stuImg.getWidth();
				height = stuImg.getHeight();
				
				if(width==1650&&height==2250)
				{
					tempImg = stuImg.getSubimage(1, 1, 1574, 2174);
					cG.drawImage(tempImg.getScaledInstance(-1, 1087, Image.SCALE_SMOOTH),38,38,null);
					tempImg = stuImg.getSubimage(75, 1, 1574, 2174);
					cG.drawImage(tempImg.getScaledInstance(-1, 1087, Image.SCALE_SMOOTH),826,38,null);
					tempImg = stuImg.getSubimage(1, 75, 1574, 2174);
					cG.drawImage(tempImg.getScaledInstance(-1, 1087, Image.SCALE_SMOOTH),38,1126,null);
					tempImg = stuImg.getSubimage(75, 75, 1574, 2174);
					cG.drawImage(tempImg.getScaledInstance(-1, 1087, Image.SCALE_SMOOTH),826,1126,null);

					tempImg.flush();
					tempImg = null;
					stuImg.flush();
					stuImg = null;
				}
				else	//Will need to program more features, such as rendering 1.5 aspect ratio pictures directly from camera.
				{
					render.printText("Height & Width must be 1650x2250!  "+s.image+" is not correct!  rendered picture is wrong!\n");
					error = true;
					cG.drawImage(stuImg, 0, 0, null);
				}
			}
			cG.setColor(Color.white);
			cG.fillRect(0, 2175, 1650, 225);
			cG.setColor(Color.black);
			cG.setFont(new Font("Arial",Font.PLAIN,40));
			if(download)
			{
				cG.drawString("Download from download.islandphotography.net/"+s.rand+".jpg", 150, 2225);
				cG.drawString(s.ref+":  "+s.homeroom+": "+s.last+", "+s.first, 150, 2270);
			}
			else
			{
				cG.drawString(s.ref+":  "+s.image+"   Count: "+s.order, 150, 2225);
				cG.drawString(s.homeroom+": "+s.last+", "+s.first, 150, 2270);
			}
			
			cG.setFont(new Font("Arial",Font.PLAIN,30));
			cG.drawString((1+count)+"", 60, 2380);
			if(includeIsland) cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 150,2305);
			
		}catch(Exception e){render.printText("Error: "+s.ref+" "+e);error = true;}
	}

	private void stackCutter(ArrayList<File> files)
	{
		int div = (files.size()+3)/4;
		int index = 0, prefix = 0;
		for(int i=0;i<4;i++)
		{
			for(int j=0;j<div;j++)
			{
				index = (i*div)+j;
				prefix = (j*4)+i;
				if(index<files.size())
				{
					files.get(index).renameTo(new File(outputPath+"\\"+String.format("%05d",prefix)+"_"+files.get(index).getName()));
				}
			}
		}
	}
	
	public static BufferedImage resize(BufferedImage img, int newW, int newH) { 
	    Image tmp = img.getScaledInstance(newW, newH, Image.SCALE_SMOOTH);
	    BufferedImage dimg = new BufferedImage(newW, newH, BufferedImage.TYPE_INT_ARGB);

	    Graphics2D g2d = dimg.createGraphics();
	    g2d.drawImage(tmp, 0, 0, null);
	    g2d.dispose();

	    return dimg;
	}  
	
    public static GraphicsConfiguration getDefaultConfiguration() {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        return gd.getDefaultConfiguration();
    }
    public BufferedImage rotate(BufferedImage image) {
    	
        int w = image.getWidth(), h = image.getHeight();
        int neww = h, newh = w;
        BufferedImage result = new BufferedImage(neww,newh,BufferedImage.TYPE_INT_RGB);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(270)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
    
    ////////////Unused code that may be useful for future/////////
    /*
     * 
				
		if((double)stuImg.getWidth()/(double)stuImg.getHeight()==1.5)
		{
			stuImg = resize(stuImg,2349,1566);
		}
		

		width = stuImg.getWidth();
		height = stuImg.getHeight();
		
		
		if(width!=1650&&height!=2250)
		{
			if(width==1566&&height==2349) cG.drawImage(stuImg,43,-48,null);
			else if((double)height/(double)width==1.5) cG.drawImage(stuImg.getScaledInstance(1566, -1, Image.SCALE_SMOOTH),43,-48,null);
			else
			{
				render.printText("\nNot 1.5: "+s.image+": Width: "+width+" Height: "+height+"\n");
				diff = (height - (width*1.36))/2;
				if(diff>=0)	stuImg = stuImg.getSubimage(0, (int)diff, width, (int)(width*1.36));
				else
				{
					diff = (width -(height*.73333))/2;
					stuImg = stuImg.getSubimage((int)diff, 0, (int)(height*.73333), height);
				}
				cG.drawImage(stuImg.getScaledInstance(1650, -1, Image.SCALE_SMOOTH),0,0,null);
			}
		}
				
     * 
     */

}
