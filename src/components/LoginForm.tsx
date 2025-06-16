import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      const { error } = await login(loginData.email, loginData.password);
      if (!error) {
        toast({
          title: "登录成功",
          description: "欢迎回来！",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "登录失败",
          description: "邮箱或密码错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "登录过程中发生错误",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [loginData, login, toast, navigate, loading]);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "两次输入的密码不一致",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await register(registerData.username, registerData.email, registerData.password);
      if (!error) {
        toast({
          title: "注册成功",
          description: "账号已创建成功",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "注册失败",
          description: "用户名或邮箱已存在",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "注册过程中发生错误",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [registerData, register, toast, navigate, loading]);

  const handleLoginInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleRegisterInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  }, []);

  const loginForm = useMemo(() => (
    <form onSubmit={handleLogin}>
      <CardHeader>
        <CardTitle>欢迎回来</CardTitle>
        <CardDescription>
          请输入您的账号信息
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            value={loginData.email}
            onChange={handleLoginInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            value={loginData.password}
            onChange={handleLoginInputChange}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full gradient-primary" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </Button>
      </CardFooter>
    </form>
  ), [loginData, handleLogin, handleLoginInputChange, loading]);

  const registerForm = useMemo(() => (
    <form onSubmit={handleRegister}>
      <CardHeader>
        <CardTitle>创建账号</CardTitle>
        <CardDescription>
          请填写以下信息创建新账号
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="请输入用户名"
            value={registerData.username}
            onChange={handleRegisterInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">邮箱</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="请输入邮箱"
            value={registerData.email}
            onChange={handleRegisterInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">密码</Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder="请输入密码"
            value={registerData.password}
            onChange={handleRegisterInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">确认密码</Label>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            value={registerData.confirmPassword}
            onChange={handleRegisterInputChange}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full gradient-primary" disabled={loading}>
          {loading ? '创建中...' : '创建账号'}
        </Button>
      </CardFooter>
    </form>
  ), [registerData, handleRegister, handleRegisterInputChange, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
            PromptHub
          </h1>
          <p className="text-muted-foreground">
            加入提示词创作者社区
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              {loginForm}
            </TabsContent>
            <TabsContent value="register">
              {registerForm}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
