package photo.software.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.OrderUnitStudentClassSortComparator;
import photo.software.comparators.OrderUnitStudentGradeSortComparator;
import photo.software.comparators.OrderUnitStudentLastNameSortComparator;
import photo.software.orders.plans.PackagePlan;

public class RenderLargeEnvelopes 
{
	private ArrayList<RenderOrder> renderList;
	private ArrayList<PackagePlan> allPlans;
	private String renderPath;
	private int sortBy, width,fontSize, count=1,envelopeItems;
	private String[] codes;
	private BufferedImage cImage, envelope=null;
	private Graphics2D cG;
	private FontMetrics fm;
	private RenderOrders orders;
	String plan = "";
	private PrintWriter log;
	
	RenderLargeEnvelopes(ArrayList<RenderOrder> renderList, ArrayList<PackagePlan> allPlans, String renderPath, RenderOrders orders, int sortBy)
	{
		this.renderList = renderList;
		this.allPlans = allPlans;
		this.renderPath = renderPath;
		this.sortBy = sortBy;
		this.orders = orders;
		
		
		if(renderList.size()==0) return;
		
		new File(renderPath).mkdir();
		if(sortBy==0) Collections.sort(renderList, new OrderUnitStudentLastNameSortComparator());
		else if(sortBy==1) Collections.sort(renderList, new OrderUnitStudentGradeSortComparator());
		else if(sortBy==2) Collections.sort(renderList, new OrderUnitStudentClassSortComparator());
	}
	public void logger(String line)
	{
		try
		{
			log = new PrintWriter(new BufferedWriter(new FileWriter(renderPath+"\\log.txt",true)));
			log.println(line);
    		log.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Unable to make Log File");}
	}
	public boolean renderLargeEnvelopes()
	{
		for(int i=0;i<renderList.size();i++)
		{
			if(plan.equals("")||(!plan.equals(renderList.get(i).plan)))
			{
				if (Thread.currentThread().isInterrupted()) {return false;}
				plan = renderList.get(i).plan;
				if(envelope!=null) envelope.flush();
				envelope = null;
				try
				{
					envelope = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\BigPortraitEnvelope.jpg"));
				}catch(IOException e)
				{
					logger("Unable to open Big Envelope Background: "+e);
					return false;
				}
			}
			cImage = new BufferedImage(3450,4950,BufferedImage.TYPE_INT_RGB);
			cG = cImage.createGraphics();
			if(!renderList.get(i).order.equals(""))
			{
				if(createLargeEnvelope(renderList.get(i)))
				{
					fillEnvelope(renderList.get(i));
					writeEnvelope(renderList.get(i));
					orders.updateProgressBar((i*100)/renderList.size(), "Envelopes: "+renderList.get(i).first+" "+renderList.get(i).last);
					count++;
				}
			}
			cImage.flush();
			cImage = null;
		}
		orders.updateProgressBar(100, "Envelopes Done!");
		if(envelope!=null) envelope.flush();
		envelope = null;
		return true;
	}
	private boolean createLargeEnvelope(RenderOrder currentOrder)
	{
		String[] codes = currentOrder.order.split("\\.");
		envelopeItems = 0;
		for(String c:codes)
		{
			for(PackagePlan p:allPlans)
			{
				if(currentOrder.plan.equals(p.plan)&&c.equals(p.code))
				{
					p.updateCounts();
					envelopeItems+=p.getBigEnvelopeCount();
					break;
				}
			}
		}
		return envelopeItems>0;
	}
	private void writeEnvelope(RenderOrder s)
	{
		try
		{
			File largeEnvelope = new File(renderPath+"\\"+s.last+"_"+s.first+"_"+count+"_BigEnvelope.jpg");
			if(sortBy==1) largeEnvelope = new File(renderPath+"\\"+s.grade+"_"+s.last+"_"+s.first+"_"+count+"_BigEnvelope.jpg");
			else if(sortBy==2) largeEnvelope = new File(renderPath+"\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+count+"_BigEnvelope.jpg");
			ImageIO.write(cImage, "jpg", largeEnvelope);
		}catch(Exception e)
		{
			logger("Error Writing: "+s.ref+": "+s.first+" "+s.last+" Error: "+e);
		}
	}
	private void fillEnvelope(RenderOrder s)
	{
		cG.setColor(Color.white);
		cG.fillRect(0, 0, 3450, 4950);
		if(envelope!=null) cG.drawImage(envelope, 0, 0, null);
		
		try
		{
			if(new File(s.jobFolder+"\\CroppedMed\\"+s.image).exists())
			{
				BufferedImage cropMed = ImageIO.read(new File(s.jobFolder+"\\CroppedMed\\"+s.image));
				if(cropMed.getWidth()>cropMed.getHeight()) cG.drawImage(cropMed.getScaledInstance(-1, 500, Image.SCALE_SMOOTH), 150, 1080, null);
				else cG.drawImage(cropMed.getScaledInstance(-1, 750, Image.SCALE_SMOOTH),150 ,1080 , null);
				cropMed.flush();
				cropMed = null;
			}
		}catch(IOException e)
		{
			logger("Error Opening Cropped Med: "+s.ref+": "+s.first+" "+s.last+" Error: "+e);
		}
		cG.setColor(Color.black);
		
		///////First and Last Name///////
		fontSize = 140;
		cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
		fm = cG.getFontMetrics();
		width = fm.stringWidth(s.first+" "+s.last);
		
		while(width>1500)
		{
			fontSize--;
			cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(s.first+" "+s.last);
		}
		cG.drawString(s.first+" "+s.last, 850, 1230);
		
		///////Grade & Homeroom///////
		fontSize = 80;
		cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
		fm = cG.getFontMetrics();
		width = fm.stringWidth(s.grade+": "+s.homeroom);
		
		while(width>1500)
		{
			fontSize--;
			cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(s.grade+": "+s.homeroom);
		}
		cG.drawString(s.grade+": "+s.homeroom, 850, 1330);
		
		///////School Name///////
		fontSize = 80;
		cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
		fm = cG.getFontMetrics();
		width = fm.stringWidth(s.schoolName);
		
		while(width>1500)
		{
			fontSize--;
			cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(s.schoolName);
		}
		cG.drawString(s.schoolName, 850, 1430);
		
		///////Barcode///////
		fontSize = 50;
		cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
		cG.drawString("Ref Num: "+s.ref, 150, 1930);
		cG.setFont(new Font("Code39FiveText",Font.PLAIN,90));
		cG.drawString("*"+s.ref+"*", 150, 2030);		
		
		///////Orders///////
		cG.setFont(new Font("Arial",Font.PLAIN,70));
		cG.drawString("------Order "+s.order+"------", 850, 1530);
		
		cG.setFont(new Font("Arial",Font.PLAIN,50));
		int orderYPosition = 1630;
		codes = s.order.split("\\.");
		String temp;
		for(String code:codes)
		{
			if(!code.equals(""))
			{
				for(PackagePlan plan:allPlans)
				{
					if(s.plan.equals(plan.plan)&&code.equals(plan.code))
					{	
						temp = plan.getContents1();
						cG.drawString(temp, 850, orderYPosition);
						orderYPosition+=65;	
						
						if(!plan.getContents2().equals(""))
						{
							temp = plan.getContents2();
							cG.drawString(temp, 850, orderYPosition);
							orderYPosition+=65;
						}
						if(!plan.getContents3().equals(""))
						{
							temp = plan.getContents3();
							cG.drawString(temp, 850, orderYPosition);
							orderYPosition+=65;
						}
						break;
					}
				}
			}
		}
		
		//////Vertical Teacher Name//////
		cG.rotate(Math.PI/2);
		cG.setFont(new Font("Arial",Font.PLAIN,80));
		cG.drawString(s.grade+": "+s.homeroom, 1080, -3250);
		cG.rotate(-Math.PI/2);		
	}
}
