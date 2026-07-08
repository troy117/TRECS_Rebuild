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

public class RenderEnvelopes 
{
	private ArrayList<RenderOrder> renderList;
	private ArrayList<PackagePlan> allPlans;
	private String renderPath;
	private int sortBy, width,fontSize, count = 1;
	private RenderOrders orders;
	private String[] codes;
	private int envelopeItems;
	private BufferedImage cImage, envelope=null;
	private Graphics2D cG;
	private FontMetrics fm;
	private PrintWriter log;
	private boolean composites;
	String plan="";
	RenderEnvelopes(ArrayList<RenderOrder> renderList, ArrayList<PackagePlan> allPlans, String renderPath, RenderOrders orders, int sortBy, boolean composites)
	{
		this.renderList = renderList;
		this.allPlans = allPlans;
		this.renderPath = renderPath;
		this.sortBy = sortBy;
		this.orders = orders;
		this.composites = composites;
		
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
	public boolean renderEnvelopes()
	{		
		for(int i=0;i<renderList.size();i++)
		{
			if (Thread.currentThread().isInterrupted()) return false;
			if(plan.equals("")||(!plan.equals(renderList.get(i).plan)))
			{
				plan = renderList.get(i).plan;
				if(envelope!=null) envelope.flush();
				envelope = null;
				try
				{
					envelope = ImageIO.read(new File("Templates\\PACKAGE_PLANS\\"+plan+"\\PortraitEnvelope.jpg"));
				}catch(IOException e)
				{
					JOptionPane.showMessageDialog(null, "Unable to open Envelope Background: "+e);
					logger("Unable to open Envelope Background: "+e);
					return false;
				}
			}
			cImage = new BufferedImage(2625,3975,BufferedImage.TYPE_INT_RGB);
			cG = cImage.createGraphics();

			if(!renderList.get(i).order.equals(""))
			{
				if(createEnvelope(renderList.get(i)))
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
	private boolean createEnvelope(RenderOrder currentOrder)
	{
		String[] codes = currentOrder.order.split("\\.");
		
		boolean actuallyNeedPrinting = false;
		for(String c:codes)
		{
			if(!(c.equals("12") || c.equals("33") || c.equals("34") || c.equals("63") || c.equals("64") || c.equals("99"))) {
				actuallyNeedPrinting = true;
			}
		}
		if(!actuallyNeedPrinting) return false;
		envelopeItems = 0;
		for(String c:codes)
		{
			for(PackagePlan p: allPlans)
			{
				if(currentOrder.plan.equals(p.plan)&&c.equals(p.code))
				{
					p.updateCounts();
					envelopeItems+=p.getEnvelopeCount();
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
			File envelope = new File(renderPath+"\\"+s.last+"_"+s.first+"_"+count+"_Envelope.jpg");
			if(sortBy==1) envelope = new File(renderPath+"\\"+s.grade+"_"+s.last+"_"+s.first+"_"+count+"_Envelope.jpg");
			else if(sortBy==2) envelope = new File(renderPath+"\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+count+"_Envelope.jpg");
			ImageIO.write(cImage, "jpg", envelope);
		}catch(Exception e)
		{
			logger("Error Writing: "+s.ref+": "+s.first+" "+s.last+" Error: "+e);
		}
	}
	private void fillEnvelope(RenderOrder s)
	{
		cG.setColor(Color.white);
		cG.fillRect(0, 0, 2625, 3975);
		if(envelope!=null) cG.drawImage(envelope, 0, 0, null);
		
		try
		{
			if(new File(s.jobFolder+"\\CroppedMed\\"+s.image).exists())
			{
				BufferedImage cropMed = ImageIO.read(new File(s.jobFolder+"\\CroppedMed\\"+s.image));
				if(cropMed.getWidth()>cropMed.getHeight()) cG.drawImage(cropMed.getScaledInstance(-1, 500, Image.SCALE_SMOOTH), 100, 740, null);
				else cG.drawImage(cropMed.getScaledInstance(-1, 750, Image.SCALE_SMOOTH),100 ,740 , null);
				cropMed.flush();
				cropMed = null;
			}
		}catch(IOException e)
		{
			logger("Error Opening Cropped Med: "+s.image+": "+s.first+" "+s.last+" Error: "+e);
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
		cG.drawString(s.first+" "+s.last, 800, 840);
		
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
		cG.drawString(s.grade+": "+s.homeroom, 800, 940);
		
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
		cG.drawString(s.schoolName, 800, 1040);
		
		///////Barcode///////
		fontSize = 50;
		cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
		cG.drawString("Ref Num: "+s.ref, 100, 1540);
		cG.setFont(new Font("Bar Code 39 d",Font.PLAIN,90));
		cG.drawString("*"+s.ref+"*", 100, 1640);		
		
		///////Orders///////
		cG.setFont(new Font("Arial",Font.PLAIN,70));
		cG.drawString("------Order "+s.order+"------", 800, 1140);
		
		cG.setFont(new Font("Arial",Font.PLAIN,70));
		int orderYPosition = 1240;
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
						if(plan.name.contains("CD")||plan.name.contains("Zip"))
						{
							temp = plan.toString();
							if(temp.contains("Mail Home"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1500, 280, 70);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Mail Home", 800, 1560);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							if(composites&&temp.contains("ClassPhoto"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1590, 1710, 70);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Class Photo will be returned separately after makeup day", 800, 1640);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							else if(composites&&temp.contains("StarPhoto"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1590, 1710, 70);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Star Class Photo will be returned separately after makeup day", 800, 1640);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							if(temp.contains("ClassPhoto")) cG.drawString(plan.name+", ClassPhoto", 800, orderYPosition);
							else if(temp.contains("StarPhoto")) cG.drawString(plan.name+", StarPhoto", 800, orderYPosition);
							else cG.drawString(plan.name, 800, orderYPosition);
							orderYPosition+=80;
							break;
						}
						
						temp = plan.getContents1();
						if(temp.contains("Mail Home"))
						{
							cG.setColor(Color.yellow);
							cG.fillRect(780, 1500, 280, 70);
							cG.setColor(Color.black);
							cG.setFont(new Font("Arial",Font.BOLD,50));
							cG.drawString("Mail Home", 800, 1560);
							cG.setFont(new Font("Arial",Font.PLAIN,50));
						}
						if(composites&&temp.contains("ClassPhoto"))
						{
							cG.setColor(Color.yellow);
							cG.fillRect(780, 1590, 1710, 70);
							cG.setColor(Color.black);
							cG.setFont(new Font("Arial",Font.BOLD,50));
							cG.drawString("Class Photo will be returned separately after makeup day", 800, 1640);
							cG.setFont(new Font("Arial",Font.PLAIN,50));
						}
						else if(composites&&temp.contains("StarPhoto"))
						{
							cG.setColor(Color.yellow);
							cG.fillRect(780, 1590, 1710, 70);
							cG.setColor(Color.black);
							cG.setFont(new Font("Arial",Font.BOLD,50));
							cG.drawString("Star Class Photo will be returned separately after makeup day", 800, 1640);
							cG.setFont(new Font("Arial",Font.PLAIN,50));
						}
						cG.setFont(new Font("Arial",Font.PLAIN,42));
						cG.drawString(temp, 800, orderYPosition);
						orderYPosition+=80;	
						
						if(!plan.getContents2().equals(""))
						{
							temp = plan.getContents2();
							if(temp.contains("Mail Home"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1500, 280, 70);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Mail Home", 800, 1560);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							if(composites&&temp.contains("ClassPhoto"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1590, 1710, 50);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Class Photo will be returned separately after makeup day", 800, 1640);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							else if(composites&&temp.contains("StarPhoto"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1590, 1710, 50);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Star Class Photo will be returned separately after makeup day", 800, 1640);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							cG.setFont(new Font("Arial",Font.PLAIN,42));
							cG.drawString(temp, 800, orderYPosition);
							orderYPosition+=60;
						}
						if(!plan.getContents3().equals(""))
						{
							temp = plan.getContents3();
							if(temp.contains("Mail Home"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1500, 280, 70);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Mail Home", 800, 1560);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							if(composites&&temp.contains("ClassPhoto"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1590, 1710, 50);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Class Photo will be returned separately after makeup day", 800, 1640);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							else if(composites&&temp.contains("StarPhoto"))
							{
								cG.setColor(Color.yellow);
								cG.fillRect(780, 1590, 1710, 50);
								cG.setColor(Color.black);
								cG.setFont(new Font("Arial",Font.BOLD,50));
								cG.drawString("Star Class Photo will be returned separately after makeup day", 800, 1640);
								cG.setFont(new Font("Arial",Font.PLAIN,50));
							}
							cG.setFont(new Font("Arial",Font.PLAIN,42));
							cG.drawString(temp, 800, orderYPosition);
							orderYPosition+=60;
						}
						break;
					}
				}
			}
		}
		
		//////Vertical Teacher Name//////
		cG.rotate(Math.PI/2);
		cG.setFont(new Font("Arial",Font.PLAIN,80));
		cG.drawString(s.grade+": "+s.homeroom, 740, -2500);
		cG.rotate(-Math.PI/2);

	}
	
}
