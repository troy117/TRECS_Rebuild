package photo.software.render;


import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.DefaultComboBoxModel;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;




import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;

import photo.software.admin.OrderTalley;
import photo.software.comparators.PackageSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.ProgramData;
import photo.software.login.SchoolData;
import photo.software.orders.plans.PackagePlan;
import photo.software.student.Student;
import photo.software.student.Students;
import photo.software.student.lists.ListItem;

import java.awt.Font;

import javax.swing.JCheckBox;

@SuppressWarnings("serial")
public class RenderOrderGUI extends JInternalFrame implements ActionListener
{
	JComboBox<String> comboBox, comboBox_1,comboBox_2;
	JLabel label_2;
	ArrayList<PackagePlan> plans;
	Student current;
	//Students studentData;
	String[] grades = {"FAC","EXMPT","PRE","TK","KIN","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15"};
	ArrayList<String> homerooms;
	String schoolPath,planDefault;
	ArrayList<String> lists;
	
	private Students students;
	private SchoolData schoolData;
	private String jobName;
	public JobData job;
	private JButton btnRenderOrders;
	private JLabel lblPackagePlan;
	private JProgressBar progressBar;
	private JLabel lblStudent;
	private JLabel lblCurrent;
	private JLabel lblOutputBy;
	private JComboBox<String> comboBox_3;
	private JButton btnOrderPrep;
	private JButton btnOrderTalley;
	private Thread renderThread;
	private JCheckBox chckbxPhotoshopRender;
	private JCheckBox chckbxIncludeUnits;
	private JCheckBox chckbxIncludeAddons;
	private JCheckBox chckbxIncludeEnvelopes;
	private JCheckBox chckbxCompositeOnEnvelope;
	private JCheckBox chckbxOrderLabels;
	/**
	 * 
	 * @param students All the students that need to be rendered
	 * @param window Used to get program data for all the package plans
	 * @param currentStudent Current student open in StudentsGUI, for rendering individual student
	 * @param homerooms Used to choose which homeroom to render
	 * @param schoolPath School Path for the job, used to retrieve images
	 * @param job Contains package plan default
	 * @param schoolData Contains school information to be used in excel report
	 * @wbp.parser.constructor
	 */
	public RenderOrderGUI(Students students, DesktopWindow window, Student currentStudent, 
			ArrayList<String> homerooms, String schoolPath, JobData job, SchoolData schoolData) {

		ProgramData program = new ProgramData(window);
		program.openPackagePlans();
		plans = program.getPackagePlans();
		Collections.sort(plans, new PackageSortComparator());
		program.close();
		
		this.job = job;
		this.schoolData = schoolData;
		this.students = students;
		current = currentStudent;
		this.homerooms = homerooms;
		this.schoolPath=schoolPath;
		this.planDefault=job.plan;
		this.jobName=job.job;

		lists = students.getListNames();
		initialize();
	}
	public RenderOrderGUI(DesktopWindow window, SchoolData schoolData)
	{
		this.schoolData = schoolData;
		
		ProgramData program = new ProgramData(window);
		program.openPackagePlans();
		plans = program.getPackagePlans();
		Collections.sort(plans, new PackageSortComparator());
		program.close();
		
		lists = new ArrayList<String>();
		initialize();
		chckbxIncludeUnits.setSelected(true);
		chckbxIncludeAddons.setSelected(true);
		chckbxIncludeEnvelopes.setSelected(true);
	}
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void initialize()
	{
		setBounds(100, 100, 900, 351);
		this.setVisible(true);
		this.setClosable(true);
		this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
		this.addInternalFrameListener(new InternalFrameListener(){
			public void internalFrameActivated(InternalFrameEvent arg0) {}
			public void internalFrameClosed(InternalFrameEvent arg0) {}
			public void internalFrameClosing(InternalFrameEvent arg0) {close();}
			public void internalFrameDeactivated(InternalFrameEvent arg0) {}
			public void internalFrameDeiconified(InternalFrameEvent arg0) {}
			public void internalFrameIconified(InternalFrameEvent arg0) {}
			public void internalFrameOpened(InternalFrameEvent arg0) {}
		});
		getContentPane().setLayout(new MigLayout("", "[130.00,right][grow]", "[][][][][][][][][][][25.00][][]"));
		
		lblPackagePlan = new JLabel("Package Plan:");
		getContentPane().add(lblPackagePlan, "cell 0 1,alignx trailing");
		
		comboBox_2 = new JComboBox<String>();
		String lastPlan = "";
		for(PackagePlan p:plans)
		{
			if(!lastPlan.equals(p.plan))
			{
				comboBox_2.addItem(lastPlan);
				lastPlan=p.plan;
			}
		}
		comboBox_2.addItem(lastPlan);
		comboBox_2.setEditable(false);
		comboBox_2.setSelectedItem(planDefault);
		getContentPane().add(comboBox_2, "cell 1 1,growx");
		
		chckbxIncludeUnits = new JCheckBox("Include Units");
		chckbxIncludeUnits.setSelected(true);
		getContentPane().add(chckbxIncludeUnits, "flowx,cell 1 2");
		
		JLabel lblRenderStudents = new JLabel("Render Students:");
		getContentPane().add(lblRenderStudents, "cell 0 3,alignx trailing");
		
		comboBox = new JComboBox<String>();
		comboBox.addActionListener(this);
		comboBox.setModel(new DefaultComboBoxModel<String>(new String[] {"All Students", "Grade", "Homeroom", "List", "Individual Student"}));
		getContentPane().add(comboBox, "cell 1 3,growx");
		
		label_2 = new JLabel("");
		getContentPane().add(label_2, "cell 0 4,alignx trailing");
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.addItem("All Students");
		comboBox_1.setVisible(false);
		getContentPane().add(comboBox_1, "cell 1 4,growx");
		
		lblOutputBy = new JLabel("Output By:");
		getContentPane().add(lblOutputBy, "cell 0 5,alignx trailing");
		
		comboBox_3 = new JComboBox<String>();
		comboBox_3.setModel(new DefaultComboBoxModel(new String[] {"Last", "Grade", "Homeroom"}));
		comboBox_3.setSelectedIndex(2);
		getContentPane().add(comboBox_3, "cell 1 5,growx");
		
		btnOrderTalley = new JButton("Order Talley");
		btnOrderTalley.addActionListener(this);
		getContentPane().add(btnOrderTalley, "cell 1 6,growx");
		
		btnOrderPrep = new JButton("Order Prep");
		btnOrderPrep.addActionListener(this);
		getContentPane().add(btnOrderPrep, "cell 1 7,growx");
		
		btnRenderOrders = new JButton("Render Orders");
		btnRenderOrders.addActionListener(this);
		getContentPane().add(btnRenderOrders, "cell 1 8,growx");
		
		lblCurrent = new JLabel("Current:");
		getContentPane().add(lblCurrent, "cell 0 11");
		
		lblStudent = new JLabel("");
		lblStudent.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblStudent, "flowx,cell 1 12,alignx left");
		
		progressBar = new JProgressBar(0,100);
		progressBar.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(progressBar, "cell 1 11,grow");
		
		chckbxIncludeAddons = new JCheckBox("Include Addons");
		chckbxIncludeAddons.setSelected(true);
		getContentPane().add(chckbxIncludeAddons, "cell 1 2");
		
		chckbxPhotoshopRender = new JCheckBox("Photoshop Render");
		getContentPane().add(chckbxPhotoshopRender, "cell 1 2");
		
		chckbxIncludeEnvelopes = new JCheckBox("Include Envelopes");
		chckbxIncludeEnvelopes.setSelected(true);
		getContentPane().add(chckbxIncludeEnvelopes, "cell 1 2");
		
		chckbxCompositeOnEnvelope = new JCheckBox("Composite on Envelope");
		chckbxCompositeOnEnvelope.setSelected(true);
		getContentPane().add(chckbxCompositeOnEnvelope, "cell 1 2");
		
		chckbxOrderLabels = new JCheckBox("Order Labels");
		getContentPane().add(chckbxOrderLabels, "cell 1 2");
	}
	public void staffStart(ArrayList<RenderOrder> staff, String plan, String renderPath, JobData job)
	{
		ArrayList<PackagePlan> selectedPlan = new ArrayList<PackagePlan>();
		for(PackagePlan p:plans) if(p.plan.equals(plan)) selectedPlan.add(p);
		
		RenderOrders rend = new RenderOrders(schoolData, job, staff, selectedPlan, this, null, null, null, renderPath,
				comboBox_3.getSelectedIndex(), chckbxIncludeUnits.isSelected(), 
				chckbxIncludeAddons.isSelected(), chckbxIncludeEnvelopes.isSelected(), "",chckbxCompositeOnEnvelope.isSelected(),chckbxOrderLabels.isSelected(),chckbxPhotoshopRender.isSelected());
		renderThread = new Thread(rend);
		renderThread.start();
		
	}
	private void close()
	{
		this.dispose();
		try{renderThread.interrupt();}catch(Exception e){}
		renderThread = null;
	}
	public Students getStudents()
	{
		return students;
	}
	public String getJobName()
	{
		return jobName;
	}
	public void updateProgressBar(int current, String text)
	{
		progressBar.setValue(current);
		lblStudent.setText(text);
	}
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==comboBox)
		{
			if(comboBox.getSelectedIndex()==0)
			{
				label_2.setText("All Students:");
				label_2.setVisible(false);
				
				label_2.setVisible(false);
				comboBox_1.removeAllItems();
				comboBox_1.addItem("All Students");
				comboBox_1.setVisible(false);
			}
			else if(comboBox.getSelectedIndex()==1)
			{
				label_2.setText("Grade:");
				label_2.setVisible(true);
				
				comboBox_1.removeAllItems();
				for(String s:grades) comboBox_1.addItem(s);
				comboBox_1.setVisible(true);
			}
			else if(comboBox.getSelectedIndex()==2)
			{
				label_2.setText("Homeroom:");
				label_2.setVisible(true);
				
				comboBox_1.removeAllItems();
				for(String s:homerooms) comboBox_1.addItem(s);
				comboBox_1.setVisible(true);
			}
			else if(comboBox.getSelectedIndex()==3)
			{
				label_2.setText("List:");
				label_2.setVisible(true);
				
				comboBox_1.removeAllItems();
				for(String s:lists) comboBox_1.addItem(s);
				comboBox_1.setVisible(true);
			}
			else if(comboBox.getSelectedIndex()==4)
			{
				label_2.setText("Student: "+current.first+" "+current.last);
				label_2.setVisible(true);
				
				comboBox_1.removeAll();
				comboBox_1.addItem(current.first+" "+current.last);
				comboBox_1.setVisible(false);
			}
		}
		else if(pressed == btnRenderOrders)
		{
			if(comboBox_2.getSelectedIndex()==0) JOptionPane.showMessageDialog(null, "Choose Package Plan");
			else
			{
				String renderPath = "";
				JFileChooser chooser = new JFileChooser();
				chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
				int returnVal = chooser.showOpenDialog(null);
				if(returnVal == JFileChooser.APPROVE_OPTION)
				{
					renderPath = chooser.getSelectedFile().getAbsolutePath();
					
					ArrayList<PackagePlan> selectedPlan = new ArrayList<PackagePlan>();
					for(PackagePlan p:plans) if(p.plan.equals(comboBox_2.getSelectedItem())) selectedPlan.add(p);
					
					RenderOrders rend = new RenderOrders(schoolData, job, buildOrders(), selectedPlan, this, null, null, null, renderPath,
							comboBox_3.getSelectedIndex(), chckbxIncludeUnits.isSelected(), 
							chckbxIncludeAddons.isSelected(), chckbxIncludeEnvelopes.isSelected(), "",chckbxCompositeOnEnvelope.isSelected(),chckbxOrderLabels.isSelected(),chckbxPhotoshopRender.isSelected());
					renderThread = new Thread(rend);
					renderThread.start();

				}
			}
		}
		else if(pressed == btnOrderPrep)
		{
			ArrayList<PackagePlan> selectedPlan = new ArrayList<PackagePlan>();
			for(PackagePlan p:plans) if(p.plan.equals(comboBox_2.getSelectedItem())) selectedPlan.add(p);
			new RenderPrep(buildOrders(), selectedPlan);
		}
		else if(pressed==btnOrderTalley)
		{
			new OrderTalley(students.getStudents(),schoolPath,schoolData.trecsName);
		}
	}
	public ArrayList<RenderOrder> buildOrders()
	{
		ArrayList<Student> renderList = new ArrayList<Student>();
		ArrayList<RenderOrder> orders = new ArrayList<RenderOrder>();

		if(comboBox.getSelectedIndex()==0)
		{
			for(Student s:students.getStudents())
			{
				if(!s.order1.equals("")||!s.order2.equals("")) renderList.add(s);
			}
		}
		else if(comboBox.getSelectedIndex()==1)
		{
			for(Student s:students.getStudents())
			{
				if(s.grade.equals(comboBox_1.getSelectedItem())
						&&(!s.order1.equals("")||!s.order2.equals(""))) renderList.add(s);
			}
		}
		else if(comboBox.getSelectedIndex()==2)
		{
			for(Student s:students.getStudents())
			{
				if(s.homeroom.equals(comboBox_1.getSelectedItem())
						&&(!s.order1.equals("")||!s.order2.equals(""))) renderList.add(s);
			}
		}
		else if(comboBox.getSelectedIndex()==3)
		{
			for(ListItem l:students.getListItems())
			{
				if(l.getList().equals(comboBox_1.getSelectedItem())
						&&(!l.getStudent().order1.equals("")||!l.getStudent().order2.equals(""))) renderList.add(l.getStudent());
			}
		}
		else if(comboBox.getSelectedIndex()==4)
		{
			renderList.add(current);
		}
		//This has "CroppedLarge" as default for all images rendered, need to update for sports
		String folder = "CroppedLarge";
		if(job.type=="SPORTS") {folder = "CroppedLargeWithBorder";}
		for(Student s:renderList)
		{
			if((!s.order1.equals(""))&&(s.order1Pay.equals("true")))
				orders.add(new RenderOrder(s.ref,s.ref+".jpg",schoolPath+"\\"+folder,(String)comboBox_2.getSelectedItem(),s.order1,
						schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_3.getSelectedIndex()));
			if((!s.order2.equals(""))&&(s.order2Pay.equals("true")))
				orders.add(new RenderOrder(s.ref,s.ref+".jpg",schoolPath+"\\"+folder,(String)comboBox_2.getSelectedItem(),s.order2,
						schoolPath,s.first,s.last,s.homeroom,s.grade,schoolData.schoolName,comboBox_3.getSelectedIndex()));
		}
		return orders;
	}
}
