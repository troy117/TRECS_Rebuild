package photo.software.spring.render;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JButton;
import javax.swing.JOptionPane;

import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.ProgramData;
import photo.software.login.SchoolData;
import photo.software.orders.plans.PackagePlan;
import photo.software.render.RenderOrder;
import photo.software.render.RenderOrders;
import photo.software.render.RenderPrep;
import photo.software.spring.SpringStudent;

import javax.swing.JProgressBar;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import javax.swing.JCheckBox;
import javax.swing.DefaultComboBoxModel;

import org.apache.commons.io.FileUtils;

@SuppressWarnings("serial")
public class RenderSpringOrderGUI extends JInternalFrame implements ActionListener
{
	private ArrayList<SpringStudent> allStudents;
	private String currentRef, schoolPath, planDefault;
	private JobData job;
	private JButton btnRenderIndividual, btnRenderAll, btnRenderList;
	private ArrayList<PackagePlan> plans;
	private JProgressBar progressBar;
	private JComboBox<String> comboBox, comboBox_1;
	private Thread renderThread;
	private JButton btnOrderPrep;
	private JLabel lblProgress;
	private JCheckBox chckbxIncludeUnits;
	private JCheckBox chckbxIncludeAddons;
	private JCheckBox chckbxIncludeEnvelopes;
	private JCheckBox chckbxPhotoshopRender;
	private SchoolData schoolData;
	private JCheckBox chckbxOrderLabels;
	private JButton btnImageAndText;
	public RenderSpringOrderGUI(ArrayList<SpringStudent> allStudents, DesktopWindow window, String currentRef,
			String schoolPath, JobData job, SchoolData schoolData) 
	{
		this.allStudents = allStudents;
		this.currentRef = currentRef;
		this.schoolPath = schoolPath;
		this.schoolData = schoolData;
		this.planDefault = job.plan;
		this.job = job;
		ProgramData program = new ProgramData(window);
		program.openPackagePlans();
		plans = program.getPackagePlans();
		program.close();
		initialize();
	}
	private void initialize()
	{
		setBounds(100, 100, 710, 372);
		this.setVisible(true);
		this.setClosable(true);
		this.addInternalFrameListener(new InternalFrameListener(){
			public void internalFrameActivated(InternalFrameEvent arg0) {}
			public void internalFrameClosed(InternalFrameEvent arg0) {}
			public void internalFrameClosing(InternalFrameEvent arg0) {close();}
			public void internalFrameDeactivated(InternalFrameEvent arg0) {}
			public void internalFrameDeiconified(InternalFrameEvent arg0) {}
			public void internalFrameIconified(InternalFrameEvent arg0) {}
			public void internalFrameOpened(InternalFrameEvent arg0) {}
		});
		getContentPane().setLayout(new MigLayout("", "[80.00][399.00,grow]", "[][][][][][][][][][][31.00][]"));
		
		JLabel lblPackagePlan = new JLabel("Package Plan:");
		getContentPane().add(lblPackagePlan, "cell 0 1,alignx trailing");
		
		comboBox = new JComboBox<String>();
		String lastPlan = "";
		for(PackagePlan p:plans)
		{
			if(!lastPlan.equals(p.plan))
			{
				comboBox.addItem(lastPlan);
				lastPlan=p.plan;
			}
		}
		comboBox.addItem(lastPlan);
		comboBox.setEditable(false);
		comboBox.setSelectedItem(planDefault);
		getContentPane().add(comboBox, "cell 1 1,growx");
		
		chckbxIncludeUnits = new JCheckBox("Include Units");
		chckbxIncludeUnits.setSelected(true);
		getContentPane().add(chckbxIncludeUnits, "flowx,cell 1 2");
		
		JLabel lblOutputBy = new JLabel("Output By:");
		getContentPane().add(lblOutputBy, "cell 0 3,alignx trailing");
		
		btnRenderAll = new JButton("Render All");
		btnRenderAll.addActionListener(this);
		
		btnRenderIndividual = new JButton("Render Individual");
		btnRenderIndividual.addActionListener(this);
		
		btnRenderList = new JButton("Render List");
		btnRenderList.addActionListener(this);
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.setModel(new DefaultComboBoxModel<String>(new String[] {"Last Name", "Grade", "Homeroom"}));
		comboBox_1.setSelectedIndex(2);
		getContentPane().add(comboBox_1, "cell 1 3,growx");
		
		btnOrderPrep = new JButton("Order Prep");
		btnOrderPrep.addActionListener(this);
		
		btnImageAndText = new JButton("Image and Text Field Prep");
		btnImageAndText.addActionListener(this);
		getContentPane().add(btnImageAndText, "cell 1 4,growx");
		getContentPane().add(btnOrderPrep, "cell 1 5,growx");
		getContentPane().add(btnRenderIndividual, "cell 1 7,growx");
		getContentPane().add(btnRenderAll, "cell 1 8,growx");
		getContentPane().add(btnRenderList, "cell 1 9,growx");
		
		JLabel lblProgressbar = new JLabel("ProgressBar:");
		getContentPane().add(lblProgressbar, "cell 0 10,alignx right");
		
		progressBar = new JProgressBar();
		getContentPane().add(progressBar, "cell 1 10,grow");
		
		lblProgress = new JLabel("Progress: ");
		getContentPane().add(lblProgress, "cell 1 11");
		
		chckbxIncludeAddons = new JCheckBox("Include Addons");
		chckbxIncludeAddons.setSelected(true);
		getContentPane().add(chckbxIncludeAddons, "cell 1 2");
		
		chckbxIncludeEnvelopes = new JCheckBox("Include Envelopes");
		chckbxIncludeEnvelopes.setSelected(true);
		getContentPane().add(chckbxIncludeEnvelopes, "cell 1 2");
		
		chckbxPhotoshopRender = new JCheckBox("Photoshop Render");
		getContentPane().add(chckbxPhotoshopRender, "cell 1 2");
		
		chckbxOrderLabels = new JCheckBox("Order Labels");
		getContentPane().add(chckbxOrderLabels, "cell 1 2");
	}
	public void updateProgressBar(int overall, String progress)
	{
		progressBar.setValue(overall);
		lblProgress.setText(progress);
	}
	public String getOutputFolder()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		if(fc.showOpenDialog(null)==JFileChooser.APPROVE_OPTION) return fc.getSelectedFile().getAbsolutePath();
		return null;
	}
	private void close()
	{
		this.dispose();
		try{renderThread.interrupt();}catch(Exception e){}
		renderThread = null;
	}
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		String outputFolder;
		ArrayList<PackagePlan> selectedPlan = new ArrayList<PackagePlan>();
		for(PackagePlan p:plans) if(p.plan.equals(comboBox.getSelectedItem())) selectedPlan.add(p);
		
		if(pressed==btnRenderIndividual)
		{
			outputFolder = getOutputFolder();
			if(outputFolder!=null)
			{
				ArrayList<RenderOrder> orders = new ArrayList<RenderOrder>();
				for(SpringStudent s:allStudents)
				{
					if(s.ref.equals(currentRef))
					{
						if(!s.order1.equals("")) orders.add(new RenderOrder(s.ref,s.img,"CroppedLarge",(String)comboBox.getSelectedItem(),s.order1,
								schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_1.getSelectedIndex()));
						if(!s.order2.equals("")) orders.add(new RenderOrder(s.ref,s.img,"CroppedLarge",(String)comboBox.getSelectedItem(),s.order2,
								schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_1.getSelectedIndex()));
					}
				}
				RenderOrders rend = new RenderOrders(schoolData, job, orders, selectedPlan, null, this, null, null, outputFolder,
						comboBox_1.getSelectedIndex(), chckbxIncludeUnits.isSelected(), 
						chckbxIncludeAddons.isSelected(), chckbxIncludeEnvelopes.isSelected(), "",false,chckbxOrderLabels.isSelected(),chckbxPhotoshopRender.isSelected());
				renderThread = new Thread(rend);
				renderThread.start();
			}
		}
		else if(pressed==btnRenderList)
		{
			outputFolder = getOutputFolder();
			if(outputFolder!=null)
			{
				//Some sort of file browser to open text file of reference numbers
				String[] ids = {};
				
				ArrayList<RenderOrder> orders = new ArrayList<RenderOrder>();
				for(SpringStudent s:allStudents)
				{
					for(String i:ids)
					{
						if(s.ref.equals(i))
						{
							if(!s.order1.equals("")) orders.add(new RenderOrder(s.ref,s.img,"CroppedLarge",(String)comboBox.getSelectedItem(),s.order1,
									schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_1.getSelectedIndex()));
							if(!s.order2.equals("")) orders.add(new RenderOrder(s.ref,s.img,"CroppedLarge",(String)comboBox.getSelectedItem(),s.order2,
									schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_1.getSelectedIndex()));
						}
					}
				}
				RenderOrders rend = new RenderOrders(schoolData, job, orders, selectedPlan, null, this, null, null, outputFolder,
						comboBox_1.getSelectedIndex(), chckbxIncludeUnits.isSelected(), 
						chckbxIncludeAddons.isSelected(), chckbxIncludeEnvelopes.isSelected(), "",false,chckbxOrderLabels.isSelected(),chckbxPhotoshopRender.isSelected());
				renderThread = new Thread(rend);
				renderThread.start();
			}
			
			
			
		}
		else if(pressed==btnImageAndText)
		{
			outputFolder = getOutputFolder();
		    String lines="";
			for(int i=0;i<allStudents.size();i++)
			{
				lines+=allStudents.get(i).img+"\t"+allStudents.get(i).text1+"\t"+allStudents.get(i).text2+"\t"+allStudents.get(i).text3+"\t"+allStudents.get(i).grade+"\n";	
			}
			
			File imgFolder = new File(schoolPath+"\\CroppedLarge");
			try {
				FileWriter myWriter = new FileWriter(outputFolder+"\\SpringInfo.txt");
			      myWriter.write(lines);
			      myWriter.close();	
				FileUtils.copyDirectory(imgFolder, new File(outputFolder));

			} catch (Exception e) {
				JOptionPane.showMessageDialog(null, "Error: "+e);
			}
			JOptionPane.showMessageDialog(null, "Done!");
		}
		else if(pressed==btnRenderAll)
		{
			outputFolder = getOutputFolder();
			RenderOrders rend = new RenderOrders(schoolData, job, buildOrders(), selectedPlan, null, this, null, null, outputFolder,
					comboBox_1.getSelectedIndex(), chckbxIncludeUnits.isSelected(), 
					chckbxIncludeAddons.isSelected(), chckbxIncludeEnvelopes.isSelected(), "",false,chckbxOrderLabels.isSelected(),chckbxPhotoshopRender.isSelected());
			renderThread = new Thread(rend);
			renderThread.start();
				//new OrderTalley(allStudents, outputFolder,schoolName);
		}
		else if(pressed==btnOrderPrep)
		{
			new RenderPrep(buildOrders(), selectedPlan);
		}
	}
	public ArrayList<RenderOrder> buildOrders()
	{
		ArrayList<RenderOrder> orders = new ArrayList<RenderOrder>();
		for(SpringStudent s:allStudents)
		{
			if(!s.order1.equals(""))
				orders.add(new RenderOrder(s.ref,s.img,"CroppedLarge",(String)comboBox.getSelectedItem(),s.order1,
						schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_1.getSelectedIndex()));
			if(!s.order2.equals(""))
				orders.add(new RenderOrder(s.ref,s.img,"CroppedLarge",(String)comboBox.getSelectedItem(),s.order2,
						schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_1.getSelectedIndex()));
		}
		return orders;
	}
}
