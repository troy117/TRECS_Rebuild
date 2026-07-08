package photo.software.login;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JLabel;

import java.awt.Font;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JButton;

import photo.software.student.Students;
import javax.swing.JComboBox;
import javax.swing.DefaultComboBoxModel;

@SuppressWarnings("serial")
public class OnlineOrdersGUI extends JInternalFrame implements ActionListener{

	private DesktopWindow window;
	private ArrayList<JobData> allJobs;
	private JTextField txtOnlineorders;
	private JButton btnBrowseForCsv;
	private List<List<String>> orders;
	private JLabel lblType;
	private JComboBox<String> comboBox;
	
	
	/**
	 * Create the frame.
	 */
	public OnlineOrdersGUI(DesktopWindow window,ArrayList<JobData> allJobs) {
		this.window = window;
		this.allJobs = allJobs;
		getContentPane().setLayout(new MigLayout("", "[][grow]", "[][][][][][]"));
		
		JLabel lblListName = new JLabel("List Name:");
		lblListName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblListName, "cell 0 2,alignx trailing");
		
		txtOnlineorders = new JTextField();
		txtOnlineorders.setText("online_orders_");
		txtOnlineorders.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(txtOnlineorders, "cell 1 2,growx");
		txtOnlineorders.setColumns(10);
		
		lblType = new JLabel("Type:");
		lblType.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblType, "cell 0 3,alignx trailing");
		
		comboBox = new JComboBox<String>();
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		comboBox.setModel(new DefaultComboBoxModel<String>(new String[] {"FALL", "SPRING"}));
		getContentPane().add(comboBox, "cell 1 3,growx");
		
		btnBrowseForCsv = new JButton("Browse for CSV Import");
		btnBrowseForCsv.addActionListener(this);
		getContentPane().add(btnBrowseForCsv, "cell 1 5,growx");
		initialize();
	}

	private void initialize()
	{
		setBounds(100, 100, 450, 300);
		this.setClosable(true);
		this.setVisible(true);
		
	}

	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==btnBrowseForCsv)
		{
			if(loadOrders()) processOrders();
			JOptionPane.showMessageDialog(null, "DONE!");
		}
		
			
					
	}
	private boolean loadOrders()
	{
		JFileChooser fc = new JFileChooser();
		int result = fc.showOpenDialog(this);
		if (result == JFileChooser.APPROVE_OPTION) 
		{
		    File selectedFile = fc.getSelectedFile();
		    orders = new ArrayList<>();
		    try
		    {
		    	BufferedReader br = new BufferedReader(new FileReader(selectedFile));
		    	String line;
		    	while((line = br.readLine())!=null)
		    	{
		    		String[] values = line.split(",");
		    		orders.add(Arrays.asList(values));
		    	}
		    	br.close();
		    }catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Orders: "+e);return false;}
		}
		return true;
	}
	private void processOrders()
	{
				String currentLocation="";
		JobData currentJob = null;
		Students studentDB = null;
		String log = "";
		for(List<String> order:orders)
		{
			if(!currentLocation.equals(order.get(0)))
			{
				currentLocation = order.get(0);
				for(JobData j:allJobs)
				{
					if(j.location.equals(currentLocation)&&j.type.equals((String)comboBox.getSelectedItem()))
					{
						currentJob = j;
						if(studentDB == null)
						{
							studentDB = new Students(window,j);
							studentDB.openStudentDatabase();
							studentDB.loadListDatabase();
						}else
						{
							studentDB.close();
							studentDB = new Students(window,j);
							studentDB.openStudentDatabase();
							studentDB.loadListDatabase();
						}
						break;
					}
				}
			}
			if(currentJob.location.equals(currentLocation)&&studentDB!=null)
			{

				if(!studentDB.updateOnlineOrder(order.get(1),order.get(2),order.get(3)))
				{
					log+=order.get(0)+"\t"+order.get(1)+"\t"+order.get(2)+"\t"+order.get(3)+"\n";
				}
				else studentDB.addStudentToList(txtOnlineorders.getText(), order.get(1), false);
			}else
			{
				log+="Most Likely Invalid School: "+order.get(0)+"\t"+order.get(1)+"\t"+order.get(2)+"\t"+order.get(3)+"\n";
				JOptionPane.showMessageDialog(null, "Should never see this... School is probably incorrect"
							+currentJob.location+" "+order.get(0)+" "+order.get(1)+" "+order.get(2)+" "+order.get(3));
			}
		}
		studentDB.close();
		if(!log.equals(""))
		{
			JOptionPane.showMessageDialog(null, "There were errors, check the log.");
			try {
				FileWriter errorLog = new FileWriter("OnlineOrderErrors.txt");
				errorLog.write(log);
				errorLog.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		else JOptionPane.showMessageDialog(null, "All Complete!");

	}
}


