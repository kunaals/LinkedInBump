//
//  ViewController.m
//  Bump
//
//  Created by Michael Royzen on 7/26/17.
//  Copyright © 2017 Michael Royzen. All rights reserved.
//

#import "ViewController.h"

@interface ViewController () {
    UIColor *blueColor;
    MBProgressHUD *hud;
}

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    blueColor = [UIColor colorWithRed:0.0/255.0 green:105/255.0 blue:163.0/255.0 alpha:1];
    [self.back setImage:[UIImage imageNamed:@"backfinal"]];
    [self.back setTintColor:[UIColor whiteColor]];
    [self.forward setImage:[UIImage imageNamed:@"forwardfinal"]];
    [self.forward setTintColor:[UIColor whiteColor]];
    [self.toolBar setBarTintColor:blueColor];
    if (self.webView.canGoBack) {
        [self.back setEnabled:YES];
    }
    else {
        [self.back setEnabled:NO];
    }
    
    if (self.webView.canGoForward) {
        [self.forward setEnabled:YES];
    }
    else {
        [self.forward setEnabled:NO];
    }
    NSURL *url = [NSURL URLWithString:@"https://linkedinbump.online"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [self.webView setDelegate:self];
    [self.webView loadRequest:request];
    // Do any additional setup after loading the view, typically from a nib.
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)webViewDidStartLoad:(UIWebView *)webView {
    //[KVNProgress showWithStatus:@"Loading"];
    hud = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    hud.labelText = @"Loading";
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    [hud hideAnimated:YES];
    
    if (webView.canGoBack) {
        [self.back setEnabled:YES];
        NSLog(@"Back enabled");
    }
    else {
        [self.back setEnabled:NO];
    }
    
    if (webView.canGoForward) {
        [self.forward setEnabled:YES];
    }
    else {
        [self.forward setEnabled:NO];
    }
}

- (IBAction)goBack:(id)sender {
    [self.webView goBack];
}

- (IBAction)goForward:(id)sender {
    [self.webView goForward];
}
@end
