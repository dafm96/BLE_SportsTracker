% Inertial pedestrian tracking.
% Accompanying article in IEEE Pervasive Magazine.
%
% For best results use a foot-mounted inertial measurement unit with an
% accelerometer range greater than 10g and a gyroscope range greater than
% 900 degrees per second and at least 50 samples per second. The IMU is not
% required to estimate orientations.
% 
%
% Copyright December 2010, Lancaster University.
% Authors: Poorna Talkad Sukumar, Carl Fischer.
% http://eis.comp.lancs.ac.uk/pdr/



clear all;

%% Read data from file.
% Data should include timestamps (seconds), 3 axis accelerations (m/s^2), 3
% axis gyroscopic rates of turn (rad/s).
%data = importdata('l.csv'); gyro_bias = [0.1738  -0.0794   -0.0213]';
%data = importdata('2.csv'); gyro_bias = [0.0066  -0.0071   0.0120]';
%data = importdata('3.csv'); gyro_bias = [0.0066  -0.0071   0.0235]';
%data = importdata('4.csv'); gyro_bias = [0.0066  -0.0071   0.025]';
%data = importdata('running.csv'); %gyro_bias = [0.0386  -0.0488   -0.00]';
%data = importdata('./wifi/out2019-09-27T15-23-00.059Z_2.csv'); gyro_bias = [-0.000082013 -0.000085558 0.00035855]';
%data = importdata('./wifi/wifi_50ms_L.csv'); gyro_bias = [-0.03159642121 -0.02312116725 0.00916183636]';
%s = [0.009526407	0.005816604	0.000457262]';
%data = importdata('./wifi/WIFI_20ms_U_2sensores.csv'); gyro_bias = [0.009526407	0.005816604	0.000457262]';
%data = importdata('s_reto_parque_20ms_71.csv'); gyro_bias = [0.1444  -0.3054  -0.0448]';
%acc_bias = [-0.1622 -1.6558 0]';
%data = importdata('2devices_s_esq.csv'); gyro_bias = [0.213 -0.041  -0.022]'; %%esq
%24/05/2019
%s parque, dir meia, esq atacador
%data = importdata('2devices_s_dir_50ms_74.csv'); gyro_bias = [0.2036  -0.1460  0.0118]'; %%dir 
%data = importdata('2devices_s_esq_50ms_71.csv'); gyro_bias = [0.1444  -0.3054  -0.0448]'; %esq
%data = importdata('testdist_50ms_74.csv'); gyro_bias = [0.2036  -0.1460  0.0118]'; %%dir 

%9/10/2019
%data = importdata('74_20ms_U_1.csv'); gyro_bias = [0.2091  -0.1451  0.0132]';
%data = importdata('71_20ms_U_1.csv'); gyro_bias = [0.1437  -0.3013  0.0402]';
%data = importdata('74_20ms_parado.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-0.821395251	-2.058536774	9.582323369]';
%data = importdata('74_20ms_U_2.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-0.821395251	-2.058536774	0.0]';
%data = importdata('74_20ms_SCorredor.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-0.8444	-2.0007	0.0]';
%2_devices_U_74_76
%data = importdata('2Devices_74_20ms_U_1.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('2Devices_76_20ms_U_1.csv'); gyro_bias = [-0.1651  0.0901  0.0347]'; acc_bias = [-1.238060718 -2.244322452 0.0]';


%10/10/2019
%data = importdata('74_20ms_6metros.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_6m_right_20ms_74.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_12m_right_20ms_74.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_18m_right_20ms_74.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%data = importdata('Linha_reta_6m_left_20ms_74.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_12m_left_20ms_74.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_18m_left_20ms_74.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%data = importdata('Linha_reta_6m_right_20ms_74_PEDRO.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_12m_right_20ms_74_PEDRO.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_18m_right_20ms_74_PEDRO.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_12m_right_20ms_74_PEDRO_corrida_lenta.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('Linha_reta_12m_right_20ms_74_PEDRO_corrida_rapida.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%11/10/2019 - 2 p�s 18m
%data = importdata('2pes_right_74_20ms_18m.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('2pes_left_76_20ms_18m.csv'); gyro_bias = [-0.1651  0.0901  0.0347]'; acc_bias = [-2.173371994 -2.758917363 0.0]';


%16/10/2019
%%% Linha Reta %%%
%data = importdata('./dados 16-10/Linha_reta_74_20ms_5passos.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('./dados 16-10/Linha_reta_74_20ms_10passos.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('./dados 16-10/Linha_reta_74_20ms_15passos.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('./dados 16-10/Linha_reta_74_20ms_20passos.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%%% L %%%
%data = importdata('./dados 16-10/L_74_20ms_2x2.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('./dados 16-10/L_74_20ms_4x4.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('./dados 16-10/L_74_20ms_6x5.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%%% U %%%
%data = importdata('./dados 16-10/U_74_20ms_2x2x2.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('./dados 16-10/U_74_20ms_4x4x4.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%%% Jogging %%%
%data = importdata('./dados 16-10/Jogging_reta_74_20ms_10passos.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('./dados 16-10/Jogging_reta_74_20ms_20passos.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%%% 1 2 e 3 passos %%%
%data = importdata('74_20ms_1passo_60cm.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('74_20ms_2passos_120cm.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('74_20ms_2passos_180cm.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%%% Caracol 18-10 %%%
%data = importdata('caracol_74_20ms_18-10.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('caracol2_74_20ms_18-10.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%%% caracol com corrida 21-10 %%%
%data = importdata('74_20ms_caracol_corrida.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%%% parque andar/andar-correr 21-10 %%%
%data = importdata('21_10-74_20ms_parque_andar.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('21_10-74_20ms_parque_andar-correr.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';


%%% caracol pe e lombar 24-10 %%%
%data = importdata('pe74_caracol_pe_lombar_direitavolver74_76_20ms.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('lombar76_caracol_pe_lombar_direitavolver74_76_20ms.csv'); gyro_bias = [-0.1651  0.0901  0.0347]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('pe74_caracol_pe_lombar_curvo_74_76_20ms.csv'); gyro_bias = [0.2091  -0.1451  0.0132]'; acc_bias = [-2.173371994 -2.758917363 0.0]';
%data = importdata('lombar76_caracol_pe_lombar_curvo_74_76_20ms.csv'); gyro_bias = [-0.1651  0.0901  0.0347]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

%%% calibração 28-10 %%%
%data = importdata('acc_calibration_20_passos_74_20ms.csv'); gyro_bias = [-0.1651  0.0901  0.0347]'; acc_bias = [-2.173371994 -2.758917363 0.0]';


%%% teste RaspberryPi %%%
data = importdata('log2019-12-04.csv'); gyro_bias = [-0.1651  0.0901  0.0347]'; acc_bias = [-2.173371994 -2.758917363 0.0]';

data_size = length(data);
timestamp = data(:,1)'; % Timestamps of measurements.
acc_s = data(:,2:4)'; % Accelerations in sensor frame.
gyro_s = data(:,5:7)'; % Rates of turn in sensor frame.
g = 9.8; % Gravity.


%% Initialise parameters.
% Orientation from accelerometers. Sensor is assumed to be stationary.
pitch = -asin(acc_s(1,1)/g);
roll = atan(acc_s(2,1)/acc_s(3,1));
yaw = 0;

C = [cos(pitch)*cos(yaw) (sin(roll)*sin(pitch)*cos(yaw))-(cos(roll)*sin(yaw)) (cos(roll)*sin(pitch)*cos(yaw))+(sin(roll)*sin(yaw));
    cos(pitch)*sin(yaw)  (sin(roll)*sin(pitch)*sin(yaw))+(cos(roll)*cos(yaw))  (cos(roll)*sin(pitch)*sin(yaw))-(sin(roll)*cos(yaw));
    -sin(pitch) sin(roll)*cos(pitch) cos(roll)*cos(pitch)];
C_prev = C;

% Preallocate storage for heading estimate. Different from direction of
% travel, the heading indicates the direction that the sensor, and therefore
% the pedestrian, is facing.
heading = nan(1, data_size);
heading(1) = yaw;

% Gyroscope bias, to be determined for each sensor.
%  -- Defined above so we don't forget to change for each dataset. --

% Preallocate storage for accelerations in navigation frame.
acc_n = nan(3, data_size);
acc_n(:,1) = C*acc_s(:,1);


% Preallocate storage for velocity (in navigation frame).
% Initial velocity assumed to be zero.
vel_n = nan(3, data_size);
vel_n(:,1) = [0 0 0]';

% Preallocate storage for position (in navigation frame).
% Initial position arbitrarily set to the origin.
pos_n = nan(3, data_size);
pos_n(:,1) = [0 0 0]';

% Preallocate storage for distance travelled used for altitude plots.
distance = nan(1,data_size-1);
distance(1) = 0;


% Error covariance matrix.
P = zeros(9);

% Process noise parameter, gyroscope and accelerometer noise.
sigma_omega = 1e-2; sigma_a = 1e-2;

% ZUPT measurement matrix.
H = [zeros(3) zeros(3) eye(3)];

% ZUPT measurement noise covariance matrix.
sigma_v = 1e-2;
R = diag([sigma_v sigma_v sigma_v]).^2;

% Gyroscope stance phase detection threshold.
gyro_threshold = 0.6;

walking = ones(1, data_size);

%% Main Loop
for t = 2:data_size
    %%% Start INS (transformation, double integration) %%%
    dt = timestamp(t) - timestamp(t-1);

    % Remove bias from gyro measurements.
    gyro_s1 = gyro_s(:,t) - gyro_bias;

    % Skew-symmetric matrix for angular rates
    ang_rate_matrix = [0   -gyro_s1(3)   gyro_s1(2);
        gyro_s1(3)  0   -gyro_s1(1);
        -gyro_s1(2)  gyro_s1(1)  0];

    % orientation estimation
    C = C_prev*(2*eye(3)+(ang_rate_matrix*dt))/(2*eye(3)-(ang_rate_matrix*dt));

    % Transforming the acceleration from sensor frame to navigation frame.
    acc_n(:,t) = 0.5*(C + C_prev)*acc_s(:,t); %without acc_bias 
    %acc_n(:,t) = 0.5*(C + C_prev)*(acc_s(:,t) - acc_bias); %with acc_bias
    
    % Velocity and position estimation using trapeze integration.
    vel_n(:,t) = vel_n(:,t-1) + ((acc_n(:,t) - [0; 0; g] )+(acc_n(:,t-1) - [0; 0; g]))*dt/2;
    pos_n(:,t) = pos_n(:,t-1) + (vel_n(:,t) + vel_n(:,t-1))*dt/2;
    
    % Skew-symmetric cross-product operator matrix formed from the n-frame accelerations.
    S = [0  -acc_n(3,t)  acc_n(2,t);
        acc_n(3,t)  0  -acc_n(1,t);
        -acc_n(2,t) acc_n(1,t) 0];
    
    % State transition matrix.
    F = [eye(3)  zeros(3,3)    zeros(3,3);
        zeros(3,3)   eye(3)  dt*eye(3);
        -dt*S  zeros(3,3)    eye(3) ];
    
    % Compute the process noise covariance Q.
    Q = diag([sigma_omega sigma_omega sigma_omega 0 0 0 sigma_a sigma_a sigma_a]*dt).^2;
    
    % Propagate the error covariance matrix.
    P = F*P*F' + Q;
    %%% End INS %%%

    % Stance phase detection and zero-velocity updates.
    if norm(gyro_s(:,t)) < gyro_threshold
        %%% Start Kalman filter zero-velocity update %%%
        % Kalman gain.
        K = (P*(H)')/((H)*P*(H)' + R);
        
        % Update the filter state.
        delta_x = K*vel_n(:,t);
        
        % Update the error covariance matrix.
        %P = (eye(9) - K*(H)) * P * (eye(9) - K*(H))' + K*R*K'; % Joseph form to guarantee symmetry and positive-definiteness.
        P = (eye(9) - K*H)*P; % Simplified covariance update found in most books.
        
        % Extract errors from the KF state.
        attitude_error = delta_x(1:3);
        pos_error = delta_x(4:6);
        vel_error = delta_x(7:9);
        %%% End Kalman filter zero-velocity update %%%
        
        %%% Apply corrections to INS estimates. %%%
        % Skew-symmetric matrix for small angles to correct orientation.
        ang_matrix = -[0   -attitude_error(3,1)   attitude_error(2,1);
            attitude_error(3,1)  0   -attitude_error(1,1);
            -attitude_error(2,1)  attitude_error(1,1)  0];
        
        % Correct orientation.
        C = (2*eye(3)+(ang_matrix))/(2*eye(3)-(ang_matrix))*C;
        
        % Correct position and velocity based on Kalman error estimates.
        vel_n(:,t)=vel_n(:,t)-vel_error;
        pos_n(:,t)=pos_n(:,t)-pos_error;
        
        walking(1, t) = 0;
    end
    heading(t) = atan2(C(2,1), C(1,1)); % Estimate and save the yaw of the sensor (different from the direction of travel). Unused here but potentially useful for orienting a GUI correctly.
    C_prev = C; % Save orientation estimate, required at start of main loop.
    
    % Compute horizontal distance.
    distance(1,t) = distance(1,t-1) + sqrt((pos_n(1,t)-pos_n(1,t-1))^2 + (pos_n(2,t)-pos_n(2,t-1))^2);
end

%% Rotate position estimates and plot.
figure;
box on;
hold on;
angle = 180; % Rotation angle required to achieve an aesthetic alignment of the figure.
rotation_matrix = [cosd(angle) -sind(angle);
    sind(angle) cosd(angle)];
pos_r = zeros(2,data_size);
for idx = 1:data_size
    pos_r(:,idx) = rotation_matrix*[pos_n(1,idx) pos_n(2,idx)]';
end
plot(pos_r(1,:),pos_r(2,:),'LineWidth',2,'Color','r');
start = plot(pos_r(1,1),pos_r(2,1),'Marker','^','LineWidth',2,'LineStyle','none');
stop = plot(pos_r(1,end),pos_r(2,end),'Marker','o','LineWidth',2,'LineStyle','none');

xlabel('x (m)');
ylabel('y (m)');
title_str = ["Estimated 2D path; Distance: " num2str(distance(1, data_size-1))];
title(title_str);
legend([start;stop],'Start','End');
axis equal;
grid;
hold off;

% figure;
% box on;
% hold on;
% pkg load statistics;
% X = pos_r';
% %colormap ("jet");
% hist3(X);
% hold off;

out = [walking', pos_r'];
#disp(out)
save pos.txt out;

%% Plot altitude estimates.
figure;
box on;
hold on;
plot(distance,pos_n(3,:),'Linewidth',2, 'Color','b');
xlabel('Distance Travelled (m)');
ylabel('z (m)');
title('Estimated altitude');
grid;

% Display lines representing true altitudes of each floor.
floor_colour = [0 0.5 0]; % Colour for lines representing floors.
floor_heights = [0 3.6 7.2 10.8]; % Altitude of each floor measured from the ground floor.
floor_names = {'A' 'B' 'C' 'D'};
lim = xlim;
for floor_idx = 1:length(floor_heights)
    line(lim, [floor_heights(floor_idx) floor_heights(floor_idx)], 'LineWidth', 2, 'LineStyle', '--', 'Color', floor_colour);
end
ax1=gca; % Save handle to main axes.
axes('YAxisLocation','right','Color','none','YTickLabel', floor_names, 'YTick', floor_heights,'XTickLabel', {});
ylim(ylim(ax1));
ylabel('Floor');
hold off;

steps = 0;
no_ones = 0;
no_zeros = 0;
last = 0;

%% Algorithm to identify steps in zeros %%
%for idx = 1:data_size
%    current = walking(idx);
%    if (last == 0 && current == 1)
%        no_zeros = 0;
%        no_ones++;
%    elseif (last == 1 && current == 1)
%        no_zeros = 0;
%        no_ones++;
%    elseif (last == 1 && current == 0)
%        no_ones = 0;
%        no_zeros++;
%    elseif (last == 0 && current == 0)
%        no_ones = 0;
%        no_zeros++;
%        if(no_zeros == 6)
%            no_ones = 0;
%            steps++;
%            printf("step: idx %d\n", idx);
%        endif
%    endif
%    printf("%d %d : %d %d\n", last, current, no_zeros, no_ones);
%
%    last = current;
%endfor

%% Algorithm to identify steps in ones %%
for idx = 1:data_size
    current = walking(idx);
    if (last == 0 && current == 1)
        no_ones++;
        no_zeros = 0;
    elseif (last == 1 && current == 1)
        no_ones++;
        if (no_ones == 12)
            no_zeros = 0;
            steps++;
            %printf("step: idx %d\n", idx);
        endif
    elseif (last == 1 && current == 0)
        no_zeros++;
        %no_ones = 0;
    elseif (last == 0 && current == 0)
        no_zeros++;
        no_ones = 0;
    endif
    %printf("%d %d : %d %d\n", last, current, no_zeros, no_ones);
    last = current;
endfor

title_str = ["Walking; Steps: " num2str(steps)];
figure;
box on;
hold on;
plot(walking);
title(title_str);
grid;
hold off;

waitfor(gcf);