//
//  ViewController.h
//  Bump
//
//  Created by Michael Royzen on 7/26/17.
//  Copyright © 2017 Michael Royzen. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MBProgressHUD.h"

@interface ViewController : UIViewController <UIWebViewDelegate>
@property (weak, nonatomic) IBOutlet UIWebView *webView;
@property (weak, nonatomic) IBOutlet UIToolbar *toolBar;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *back;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *forward;
- (IBAction)goBack:(id)sender;
- (IBAction)goForward:(id)sender;


@end

