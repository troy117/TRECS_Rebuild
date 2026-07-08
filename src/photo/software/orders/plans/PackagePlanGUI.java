package photo.software.orders.plans;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JOptionPane;

import photo.software.comparators.PackageSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.ProgramData;

import javax.swing.JTextField;


@SuppressWarnings("serial")
public class PackagePlanGUI extends JInternalFrame implements ActionListener
{
	JComboBox<String> comboBox, comboBox_1, comboBox_2, comboBox_3, comboBox_4, comboBox_5, comboBox_6, 
					comboBox_7, comboBox_8, comboBox_9, comboBox_10, comboBox_11,
					comboBox_12, comboBox_13, comboBox_14, comboBox_15, comboBox_16;
	private JLabel lblPackagePlan,lblPackage;
	ArrayList<PackagePlan> plans;
	PackagePlan currentPlan;
	ArrayList<String> pages;
	private JButton btnAddPackage, btnClose,btnDelete;
	private JButton btnAddPackagePlan;
	ProgramData program;
	private JLabel lblName;
	private JTextField textField;
	private JLabel lblPage;
	private JLabel lblPage_9;
	
	private String itemLine,planLine;
	private JLabel lblPage_10;
	private JLabel lblPage_11;
	private JLabel lblPage_12;
	private JLabel lblPage_13;
	private JLabel lblPage_14;

	public PackagePlanGUI(DesktopWindow window) 
	{
		currentPlan=null;
		program = new ProgramData(window);
		program.openPackagePlans();
		plans = program.getPackagePlans();
		Collections.sort(plans, new PackageSortComparator());
		pages = new ArrayList<String>();
		
		try
		{
			File items = new File("TEMPLATES\\ITEMS.txt");
			if(items.exists())
			{
				Scanner itemScanner = new Scanner(items);
				while(itemScanner.hasNext())
				{
					itemLine = itemScanner.nextLine();
					if(!itemLine.contains("\\\\")) pages.add(itemLine);
					
				}
				itemScanner.close();
			}else JOptionPane.showMessageDialog(null, "ITEMS.txt File does not exist!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH ITEMS FILE!");}

		
		initialize();
	}
	private void newPlan(String plan)
	{
		try
		{
			File planFile = new File("TEMPLATES\\DEFAULT_PLAN.txt");
			if(planFile.exists())
			{
				Scanner planScanner = new Scanner(planFile);
				while(planScanner.hasNext())
				{
					planLine = planScanner.nextLine();
					if(!planLine.contains("\\\\"))
					{
						String[] temp = planLine.split("\t");
						if(temp.length==2) plans.add(new PackagePlan(plan, temp[0], temp[1]));
						else if(temp.length==3) plans.add(new PackagePlan(plan, temp[0], temp[1], temp[2]));
					}
				}
				planScanner.close();
			}else JOptionPane.showMessageDialog(null, "DEFAULT_PLAN.txt File does not exist!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH PLAN FILE!");}

	}
	private void initialize()
	{
		setBounds(100, 100, 700, 675);
		this.setVisible(true);
		getContentPane().setLayout(new MigLayout("", "[119.00][48.00][67.00][][187.00,grow][][][][]", "[][][][][][][][][][][][][][][][][][][][][][][][]"));
		
		////////////Package Plans/////////////////
		lblPackagePlan = new JLabel("Package Plan");
		getContentPane().add(lblPackagePlan, "cell 0 1");
		
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
		comboBox.addActionListener(this);
		getContentPane().add(comboBox, "cell 0 2 3 1,growx");
		
		btnAddPackagePlan = new JButton("Add Package Plan");
		btnAddPackagePlan.addActionListener(this);
		getContentPane().add(btnAddPackagePlan, "cell 0 3");
		
		lblName = new JLabel("Name:");
		getContentPane().add(lblName, "cell 3 4,alignx trailing");
		
		textField = new JTextField();
		getContentPane().add(textField, "cell 4 4,growx");
		textField.setColumns(10);
		
		//////////////Package Pages//////////////
		JLabel lblPage_1 = new JLabel("Page1");
		getContentPane().add(lblPage_1, "cell 3 5,alignx trailing");
		
		comboBox_1 = new JComboBox<String>();
		getContentPane().add(comboBox_1, "cell 4 5,growx");
		
		JLabel lblPage_2 = new JLabel("Page2");
		getContentPane().add(lblPage_2, "cell 3 6,alignx trailing");
		
		comboBox_2 = new JComboBox<String>();
		getContentPane().add(comboBox_2, "cell 4 6,growx");
		
		JLabel lblPage_3 = new JLabel("Page3");
		getContentPane().add(lblPage_3, "cell 3 7,alignx trailing");
		
		comboBox_3 = new JComboBox<String>();
		getContentPane().add(comboBox_3, "cell 4 7,growx");
		
		JLabel lblPage_4 = new JLabel("Page4");
		getContentPane().add(lblPage_4, "cell 3 8,alignx trailing");
		
		comboBox_4 = new JComboBox<String>();
		getContentPane().add(comboBox_4, "cell 4 8,growx");
		
		JLabel lblPage_5 = new JLabel("Page5");
		getContentPane().add(lblPage_5, "cell 3 9,alignx trailing");
		
		comboBox_5 = new JComboBox<String>();
		getContentPane().add(comboBox_5, "cell 4 9,growx");
		
		JLabel lblPage_6 = new JLabel("Page6");
		getContentPane().add(lblPage_6, "cell 3 10,alignx trailing");
		
		comboBox_6 = new JComboBox<String>();
		getContentPane().add(comboBox_6, "cell 4 10,growx");
		
		JLabel lblPage_7 = new JLabel("Page7");
		getContentPane().add(lblPage_7, "cell 3 11,alignx trailing");
		
		comboBox_7 = new JComboBox<String>();
		getContentPane().add(comboBox_7, "cell 4 11,growx");
		
		JLabel lblPage_8 = new JLabel("Page8");
		getContentPane().add(lblPage_8, "cell 3 12,alignx trailing");
		
		comboBox_8 = new JComboBox<String>();
		getContentPane().add(comboBox_8, "cell 4 12,growx");
		
		lblPage = new JLabel("Page9");
		getContentPane().add(lblPage, "cell 3 13,alignx trailing");
		
		comboBox_10 = new JComboBox<String>();
		getContentPane().add(comboBox_10, "cell 4 13,growx");
		
		lblPage_9 = new JLabel("Page10");
		getContentPane().add(lblPage_9, "cell 3 14,alignx trailing");
		
		comboBox_11 = new JComboBox<String>();
		getContentPane().add(comboBox_11, "cell 4 14,growx");
		
		lblPage_10 = new JLabel("Page11");
		getContentPane().add(lblPage_10, "cell 3 15,alignx trailing");
		
		comboBox_12 = new JComboBox<String>();
		getContentPane().add(comboBox_12, "cell 4 15,growx");
		
		lblPage_11 = new JLabel("Page12");
		getContentPane().add(lblPage_11, "cell 3 16,alignx trailing");
		
		comboBox_13 = new JComboBox<String>();
		getContentPane().add(comboBox_13, "cell 4 16,growx");
		
		lblPage_12 = new JLabel("Page13");
		getContentPane().add(lblPage_12, "cell 3 17,alignx trailing");
		
		comboBox_14 = new JComboBox<String>();
		getContentPane().add(comboBox_14, "cell 4 17,growx");
		
		lblPage_13 = new JLabel("Page14");
		getContentPane().add(lblPage_13, "cell 3 18,alignx trailing");
		
		comboBox_15 = new JComboBox<String>();
		getContentPane().add(comboBox_15, "cell 4 18,growx");
		
		lblPage_14 = new JLabel("Page15");
		getContentPane().add(lblPage_14, "cell 3 19,alignx trailing");
		
		comboBox_16 = new JComboBox<String>();
		getContentPane().add(comboBox_16, "cell 4 19,growx");
		
		
		loadBoxes();

		
		
		////////Package///////
		lblPackage = new JLabel("Package");
		getContentPane().add(lblPackage, "cell 0 20,alignx trailing");
		
		comboBox_9 = new JComboBox<String>();
		comboBox_9.addActionListener(this);
		getContentPane().add(comboBox_9, "cell 1 20,growx");
		
		btnAddPackage = new JButton("Add Package");
		btnAddPackage.addActionListener(this);
		getContentPane().add(btnAddPackage, "cell 0 21,alignx right");
		
		btnDelete = new JButton("Delete");
		btnDelete.addActionListener(this);
		getContentPane().add(btnDelete, "flowx,cell 4 23");
		
		btnClose = new JButton("Close");
		btnClose.addActionListener(this);
		getContentPane().add(btnClose, "cell 8 23");

	}


	public void loadBoxes()
	{
		comboBox_1.addItem("");
		comboBox_2.addItem("");
		comboBox_3.addItem("");
		comboBox_4.addItem("");
		comboBox_5.addItem("");
		comboBox_6.addItem("");
		comboBox_7.addItem("");
		comboBox_8.addItem("");
		comboBox_10.addItem("");
		comboBox_11.addItem("");
		comboBox_12.addItem("");
		comboBox_13.addItem("");
		comboBox_14.addItem("");
		comboBox_15.addItem("");
		comboBox_16.addItem("");
		for(String t:pages)
		{
			comboBox_1.addItem(t);
			comboBox_2.addItem(t);
			comboBox_3.addItem(t);
			comboBox_4.addItem(t);
			comboBox_5.addItem(t);
			comboBox_6.addItem(t);
			comboBox_7.addItem(t);
			comboBox_8.addItem(t);
			comboBox_10.addItem(t);
			comboBox_11.addItem(t);
			comboBox_12.addItem(t);
			comboBox_13.addItem(t);
			comboBox_14.addItem(t);
			comboBox_15.addItem(t);
			comboBox_16.addItem(t);
		}
	}
	private void close()
	{
		if(currentPlan!=null)
		{
			currentPlan.name=textField.getText();
			currentPlan.f[0]=(String)comboBox_1.getSelectedItem();
			currentPlan.f[1]=(String)comboBox_2.getSelectedItem();
			currentPlan.f[2]=(String)comboBox_3.getSelectedItem();
			currentPlan.f[3]=(String)comboBox_4.getSelectedItem();
			currentPlan.f[4]=(String)comboBox_5.getSelectedItem();
			currentPlan.f[5]=(String)comboBox_6.getSelectedItem();
			currentPlan.f[6]=(String)comboBox_7.getSelectedItem();
			currentPlan.f[7]=(String)comboBox_8.getSelectedItem();
			currentPlan.f[8]=(String)comboBox_10.getSelectedItem();
			currentPlan.f[9]=(String)comboBox_11.getSelectedItem();
			currentPlan.f[10]=(String)comboBox_12.getSelectedItem();
			currentPlan.f[11]=(String)comboBox_13.getSelectedItem();
			currentPlan.f[12]=(String)comboBox_14.getSelectedItem();
			currentPlan.f[13]=(String)comboBox_15.getSelectedItem();
			currentPlan.f[14]=(String)comboBox_16.getSelectedItem();
		}
		for(PackagePlan p:plans) program.savePackagePlan(p);
		program.close();
		this.dispose();
	}
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed=arg0.getSource();
		//Package Plan
		if(pressed==comboBox)
		{
			if(comboBox.getSelectedIndex()!=0)
			{
				if(currentPlan!=null)
				{
					currentPlan.name=textField.getText();
					currentPlan.f[0]=(String)comboBox_1.getSelectedItem();
					currentPlan.f[1]=(String)comboBox_2.getSelectedItem();
					currentPlan.f[2]=(String)comboBox_3.getSelectedItem();
					currentPlan.f[3]=(String)comboBox_4.getSelectedItem();
					currentPlan.f[4]=(String)comboBox_5.getSelectedItem();
					currentPlan.f[5]=(String)comboBox_6.getSelectedItem();
					currentPlan.f[6]=(String)comboBox_7.getSelectedItem();
					currentPlan.f[7]=(String)comboBox_8.getSelectedItem();
					currentPlan.f[8]=(String)comboBox_10.getSelectedItem();
					currentPlan.f[9]=(String)comboBox_11.getSelectedItem();
					currentPlan.f[10]=(String)comboBox_12.getSelectedItem();
					currentPlan.f[11]=(String)comboBox_13.getSelectedItem();
					currentPlan.f[12]=(String)comboBox_14.getSelectedItem();
					currentPlan.f[13]=(String)comboBox_15.getSelectedItem();
					currentPlan.f[14]=(String)comboBox_16.getSelectedItem();
				}
				comboBox_9.removeAllItems();
				comboBox_9.addItem("");
				for(PackagePlan p:plans)
				{
					if(p.plan.equals(comboBox.getSelectedItem()))
					{
						comboBox_9.addItem(p.code);
					}
				}
			}
			else
			{
				textField.setText("");
				comboBox_1.setSelectedIndex(0);
				comboBox_2.setSelectedIndex(0);
				comboBox_3.setSelectedIndex(0);
				comboBox_4.setSelectedIndex(0);
				comboBox_5.setSelectedIndex(0);
				comboBox_6.setSelectedIndex(0);
				comboBox_7.setSelectedIndex(0);
				comboBox_8.setSelectedIndex(0);
				comboBox_10.setSelectedIndex(0);
				comboBox_11.setSelectedIndex(0);
				comboBox_12.setSelectedIndex(0);
				comboBox_13.setSelectedIndex(0);
				comboBox_14.setSelectedIndex(0);
				comboBox_15.setSelectedIndex(0);
				comboBox_16.setSelectedIndex(0);
				comboBox_9.removeAllItems();
			}
		}
		else if(pressed==comboBox_9)
		{
			if(comboBox.getSelectedIndex()!=0&&comboBox_9.getSelectedIndex()!=0)
			{
				if(currentPlan!=null)
				{
					currentPlan.name=textField.getText();
					currentPlan.f[0]=(String)comboBox_1.getSelectedItem();
					currentPlan.f[1]=(String)comboBox_2.getSelectedItem();
					currentPlan.f[2]=(String)comboBox_3.getSelectedItem();
					currentPlan.f[3]=(String)comboBox_4.getSelectedItem();
					currentPlan.f[4]=(String)comboBox_5.getSelectedItem();
					currentPlan.f[5]=(String)comboBox_6.getSelectedItem();
					currentPlan.f[6]=(String)comboBox_7.getSelectedItem();
					currentPlan.f[7]=(String)comboBox_8.getSelectedItem();
					currentPlan.f[8]=(String)comboBox_10.getSelectedItem();
					currentPlan.f[9]=(String)comboBox_11.getSelectedItem();
					currentPlan.f[10]=(String)comboBox_12.getSelectedItem();
					currentPlan.f[11]=(String)comboBox_13.getSelectedItem();
					currentPlan.f[12]=(String)comboBox_14.getSelectedItem();
					currentPlan.f[13]=(String)comboBox_15.getSelectedItem();
					currentPlan.f[14]=(String)comboBox_16.getSelectedItem();
				}
				for(PackagePlan p:plans)
				{
					if(p.plan.equals(comboBox.getSelectedItem())&&p.code.equals(comboBox_9.getSelectedItem()))
					{
						currentPlan=p;
						textField.setText(p.name);
						comboBox_1.setSelectedItem(p.f[0]);
						comboBox_2.setSelectedItem(p.f[1]);
						comboBox_3.setSelectedItem(p.f[2]);
						comboBox_4.setSelectedItem(p.f[3]);
						comboBox_5.setSelectedItem(p.f[4]);
						comboBox_6.setSelectedItem(p.f[5]);
						comboBox_7.setSelectedItem(p.f[6]);
						comboBox_8.setSelectedItem(p.f[7]);
						comboBox_10.setSelectedItem(p.f[8]);
						comboBox_11.setSelectedItem(p.f[9]);
						comboBox_12.setSelectedItem(p.f[10]);
						comboBox_13.setSelectedItem(p.f[11]);
						comboBox_14.setSelectedItem(p.f[12]);
						comboBox_15.setSelectedItem(p.f[13]);
						comboBox_16.setSelectedItem(p.f[14]);
						break;
					}
				}
			}
			else
			{
				currentPlan=null;
				textField.setText("");
				comboBox_1.setSelectedIndex(0);
				comboBox_2.setSelectedIndex(0);
				comboBox_3.setSelectedIndex(0);
				comboBox_4.setSelectedIndex(0);
				comboBox_5.setSelectedIndex(0);
				comboBox_6.setSelectedIndex(0);
				comboBox_7.setSelectedIndex(0);
				comboBox_8.setSelectedIndex(0);
				comboBox_10.setSelectedIndex(0);
				comboBox_11.setSelectedIndex(0);
				comboBox_12.setSelectedIndex(0);
				comboBox_13.setSelectedIndex(0);
				comboBox_14.setSelectedIndex(0);
				comboBox_15.setSelectedIndex(0);
				comboBox_16.setSelectedIndex(0);
			}
		}
		else if(pressed==btnClose)
		{
			close();
		}
		else if(pressed==btnDelete&&currentPlan!=null)
		{
			plans.remove(currentPlan);
			program.remove(currentPlan);
			comboBox.setSelectedIndex(comboBox.getSelectedIndex());
			currentPlan=null;
		}
		else if(pressed==btnAddPackage)
		{
			String temp = JOptionPane.showInputDialog(null);
			if(temp!=null&&(!temp.equals("")))
			{
				plans.add(new PackagePlan((String)comboBox.getSelectedItem(),temp));
				comboBox_9.addItem(temp);
			}
		}
		else if(pressed==btnAddPackagePlan)
		{
			String name="";
			comboBox.addItem(name = JOptionPane.showInputDialog(null,"Type the name of the new Package Plan"));
			if(name!=null)
			{
				newPlan(name);
			}
		}
	}

}
