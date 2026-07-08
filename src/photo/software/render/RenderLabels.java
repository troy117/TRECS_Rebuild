package photo.software.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.OrderUnitStudentClassSortComparator;
import photo.software.comparators.OrderUnitStudentGradeSortComparator;
import photo.software.comparators.OrderUnitStudentLastNameSortComparator;
import photo.software.orders.plans.PackagePlan;

public class RenderLabels 
{
	private ArrayList<RenderOrder> renderList;
	private String renderPath;
	private BufferedImage  cImage;
	private Graphics2D cG;
	private ArrayList<PackagePlan> allPlans;
	private RenderOrders orders;
	private String[] codes;
	private FontMetrics fm;
	int sortBy, fontSize, width, count=1;
	
	public RenderLabels(ArrayList<RenderOrder> renderList, ArrayList<PackagePlan> allPlans, String renderPath,
			RenderOrders orders, int sortBy)
	{
		this.renderList = renderList;
		this.renderPath = renderPath;
		this.allPlans = allPlans;
		this.orders = orders;
		this.sortBy = sortBy;
		
		if(renderList.size()==0) return;
		
		new File(renderPath).mkdir();
		if(sortBy==0) Collections.sort(renderList, new OrderUnitStudentLastNameSortComparator());
		else if(sortBy==1) Collections.sort(renderList, new OrderUnitStudentGradeSortComparator());
		else if(sortBy==2) Collections.sort(renderList, new OrderUnitStudentClassSortComparator());
		
		renderLabel();
	}
	private void renderLabel()
	{	
		cImage = new BufferedImage(1200,600,BufferedImage.TYPE_INT_RGB);
		cG = cImage.createGraphics();
		
		for(int i=0;i<renderList.size();i++)
		{
			if(!renderList.get(i).order.equals(""))
			{
				fillLabel(renderList.get(i));
				writeLabel(renderList.get(i));
				orders.updateProgressBar((i*100)/renderList.size(), "Labels: "+renderList.get(i).first+" "+renderList.get(i).last);
			}
		}
		orders.updateProgressBar(100, "Labels Done!");
		cImage.flush();
		cImage = null;
	}
	
	private void writeLabel(RenderOrder s)
	{
		try
		{
			File label = new File(renderPath+"\\"+s.last+"_"+s.first+"_"+count+"_label.jpg");
			if(sortBy==1) label = new File(renderPath+"\\"+s.grade+"_"+s.last+"_"+s.first+"_"+count+"_label.jpg");
			else if(sortBy==2) label = new File(renderPath+"\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+count+"_label.jpg");
			ImageIO.write(cImage, "jpg", label);
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Writing Label: "+e);}
		count++;
	}
	
	private void fillLabel(RenderOrder s)
	{
		try
		{
			cG.setColor(Color.white);
			cG.fillRect(0, 0, 1200,600);
			cG.setColor(Color.black);
			try{
				cG.drawImage(ImageIO.read(new File(s.jobFolder+"\\CroppedMed\\"+s.image)).getScaledInstance(-1, 550, Image.SCALE_SMOOTH),25,25,null);
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Error Creating Label, error opening student: "+s.ref);}
			
			
			///////First and Last Name///////
			fontSize = 60;
			cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(s.first+" "+s.last);
			
			while(width>580)
			{
				fontSize--;
				cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = cG.getFontMetrics();
				width = fm.stringWidth(s.first+" "+s.last);
			}
			cG.drawString(s.first+" "+s.last, 600, 100);
			
			///////Grade & Homeroom///////
			fontSize = 60;
			cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(s.grade+": "+s.homeroom);
			
			while(width>580)
			{
				fontSize--;
				cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = cG.getFontMetrics();
				width = fm.stringWidth(s.grade+": "+s.homeroom);
			}
			cG.drawString(s.grade+": "+s.homeroom, 600, 180);
			
			///////School Name///////
			fontSize = 60;
			cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = cG.getFontMetrics();
			width = fm.stringWidth(s.schoolName);
			
			while(width>580)
			{
				fontSize--;
				cG.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = cG.getFontMetrics();
				width = fm.stringWidth(s.schoolName);
			}
			cG.drawString(s.schoolName, 600, 260);
			
			///////Barcode///////
			
			cG.drawString("Ref Num: "+s.ref, 600, 465);
			cG.setFont(new Font("Code39FiveText",Font.PLAIN,70));
			cG.drawString("*"+s.ref+"*", 600, 550);	
			
			
			///////Orders///////
			cG.setFont(new Font("Arial",Font.PLAIN,30));
			cG.drawString("----Orders: "+s.order+"----", 600, 300);
			
			int orderYPosition = 340;
			codes = s.order.split("\\.");
			for(String code:codes)
			{
				for(PackagePlan plan:allPlans)
				{
					if(s.plan.equals(plan.plan)&&code.equals(plan.code))
					{	
						cG.drawString(plan.getContents1(), 600, orderYPosition);
						orderYPosition+=35;
						if(!plan.getContents2().equals(""))
						{
							cG.drawString(plan.getContents2(), 600, orderYPosition);
							orderYPosition+=35;
						}
						if(!plan.getContents3().equals(""))
						{
							cG.drawString(plan.getContents3(), 600, orderYPosition);
							orderYPosition+=35;
						}
						break;
					}
				}
			}
			
		}
		catch(Exception e){JOptionPane.showMessageDialog(null, "Error Card Creator: "+e);}
	}
}