package photo.software.render;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JInternalFrame;

import photo.software.comparators.PackageSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.ProgramData;
import photo.software.login.SchoolData;
import photo.software.orders.plans.PackagePlan;
import photo.software.senior.Senior;
import photo.software.senior.SeniorGUI;
import photo.software.senior.Seniors;
import net.miginfocom.swing.MigLayout;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JComboBox;
import javax.swing.JFileChooser;
import javax.swing.JButton;
import javax.swing.JProgressBar;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;

import org.json.JSONObject;

public class RenderSeniorGUI extends JInternalFrame implements ActionListener{

	private static final long serialVersionUID = 1L;

	
	private Seniors seniors;
	private String schoolPath;
	private JobData job;
	private SchoolData schoolData;
	private ArrayList<PackagePlan> plans;
	private String planDefault;
	
	private Thread renderThread;
	
	private JLabel lbl_Student;
	private JButton btn_OrderPrep,btn_RenderOrders;
	private JProgressBar progressBar;
	private SeniorGUI gui;
	
	
	private JComboBox<String> comboBox, comboBox_1, comboBox_2;
	/**
	 * Create the frame.
	 */
	public RenderSeniorGUI(Seniors seniors, DesktopWindow window, String schoolPath, JobData job, SchoolData schoolData, SeniorGUI gui) {
		
		this.seniors = seniors;
		this.schoolPath = schoolPath;
		this.job = job;
		planDefault = job.plan;
		this.schoolData = schoolData;
		this.gui = gui;
		
		
		ProgramData program = new ProgramData(window);
		program.openPackagePlans();
		plans = program.getPackagePlans();
		Collections.sort(plans, new PackageSortComparator());
		program.close();
		
		initialize();		
		
	}
	
	private void initialize()
	{
		setBounds(100, 100, 450, 300);
		this.setLocation(0, 0);
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
		
		getContentPane().setLayout(new MigLayout("", "[][][grow]", "[][][][][][][][][]"));
		
		JLabel lbl_PackagePlan = new JLabel("Package Plan:");
		getContentPane().add(lbl_PackagePlan, "cell 1 1,alignx trailing");
		
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
		getContentPane().add(comboBox, "cell 2 1,growx");
		
		btn_OrderPrep = new JButton("Order Prep");
		btn_OrderPrep.addActionListener(this);
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.addItem("All Students");
		comboBox_1.addItem("Current Student");
		comboBox_1.addItem("List");
		comboBox_1.addActionListener(this);
		getContentPane().add(comboBox_1, "cell 2 3,growx");
		
		comboBox_2 = new JComboBox<String>();
		comboBox_2.setVisible(false);
		getContentPane().add(comboBox_2, "cell 2 4,growx");
		getContentPane().add(btn_OrderPrep, "cell 2 5,growx");
		
		btn_RenderOrders = new JButton("Render Orders");
		btn_RenderOrders.addActionListener(this);
		getContentPane().add(btn_RenderOrders, "cell 2 6,growx");
		
		JLabel lbl_Current = new JLabel("Current:");
		getContentPane().add(lbl_Current, "cell 1 7");
		
		progressBar = new JProgressBar();
		getContentPane().add(progressBar, "cell 2 7,growx");
		
		lbl_Student = new JLabel("");
		getContentPane().add(lbl_Student, "cell 2 8");
	}
	
	private ArrayList<RenderOrder> buildOrders()
	{
		ArrayList<RenderOrder> orders = new ArrayList<RenderOrder>();
		JSONObject json;
		if(comboBox_1.getSelectedIndex()==0)
		{
			for(Senior s:seniors.getSeniors())
			{
				if(!s.orders.equals(""))
				{
					json = new JSONObject(s.orders==null || s.orders.isEmpty() ? "{}" : s.orders);
					for(String key: json.keySet())
					{
						RenderOrder render = new RenderOrder(s.ref,
																key,
																schoolPath+"\\CroppedLarge",
																comboBox.getSelectedItem().toString(),
																(String)json.get(key),
																schoolPath,
																s.first,
																s.last,
																s.homeroom,
																"12",
																schoolData.schoolName,
																0);
						orders.add(render);	
					}
				}
			}
		}
		else if(comboBox_1.getSelectedIndex()==1)
		{
			for(Senior s:seniors.getSeniors())
			{
				if(s.orders.equals(gui.getCurrentRef()))
				{
					json = new JSONObject(s.orders==null || s.orders.isEmpty() ? "{}" : s.orders);
					for(String key: json.keySet())
					{
						RenderOrder render = new RenderOrder(s.ref,
																key,
																schoolPath+"\\CroppedLarge",
																comboBox.getSelectedItem().toString(),
																(String)json.get(key),
																schoolPath,
																s.first,
																s.last,
																s.homeroom,
																"12",
																schoolData.schoolName,
																0);
						orders.add(render);	
					}
				}
			}
		}
		else if(comboBox_1.getSelectedIndex()==2)
		{
			for(Senior s:seniors.getStudentsFromList((String)comboBox_2.getSelectedItem()))
			{
				json = new JSONObject(s.orders==null || s.orders.isEmpty() ? "{}" : s.orders);
				for(String key: json.keySet())
				{
					RenderOrder render = new RenderOrder(s.ref,
															key,
															schoolPath+"\\CroppedLarge",
															comboBox.getSelectedItem().toString(),
															(String)json.get(key),
															schoolPath,
															s.first,
															s.last,
															s.homeroom,
															"12",
															schoolData.schoolName,
															0);
					orders.add(render);	
				}
				
			}
		}
		return orders;
	}
	
	public void updateProgressBar(int current, String text)
	{
		progressBar.setValue(current);
		lbl_Student.setText(text);
	}

	private void close()
	{
		this.dispose();
		
		if(renderThread != null && renderThread.isAlive())
		{
			renderThread.interrupt();
		}
			
        try {
            renderThread.join(); // Wait for the thread to finish
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
		renderThread = null;
	}
	
	@Override
	public void actionPerformed(ActionEvent e) 
	{
		Object pressed = e.getSource();
		if(pressed==btn_OrderPrep)
		{
			ArrayList<PackagePlan> selectedPlan = new ArrayList<PackagePlan>();
			for(PackagePlan p:plans) if(p.plan.equals(comboBox.getSelectedItem())) selectedPlan.add(p);
			new RenderPrep(buildOrders(), selectedPlan);
		}
		else if(pressed==comboBox_1)
		{
			if(comboBox_1.getSelectedIndex()==2)
			{
				comboBox_2.setVisible(true);
				comboBox_2.removeAllItems();
				for(String s:seniors.getListNames()) comboBox_2.addItem(s);
			}
			else 
			{
				comboBox_2.setVisible(false);
			}
		}
		
		else if(pressed==btn_RenderOrders)
		{
			if(comboBox.getSelectedIndex()==0) JOptionPane.showMessageDialog(null, "Choose Package Plan");
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
					for(PackagePlan p:plans) if(p.plan.equals(comboBox.getSelectedItem())) selectedPlan.add(p);
					
					renderThread = new Thread(new RenderOrders(schoolData, job, buildOrders(), selectedPlan, null, null, null, this, renderPath,0, true, true, true, "",false,false,false));
					renderThread.start();

				}
			}
		}
	}

}
