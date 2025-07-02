import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const ModelConfig: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [maxTokens, setMaxTokens] = useState('4096');
  const [temperature, setTemperature] = useState('0.7');
  const [enabled, setEnabled] = useState(false);

  const providers = [
    { value: 'openai', label: 'OpenAI', models: ['gpt-4', 'gpt-3.5-turbo'] },
    { value: 'qianwen', label: '阿里千问', models: ['qwen-turbo', 'qwen-plus', 'qwen-max'] },
    { value: 'doubao', label: '豆包', models: ['doubao-lite', 'doubao-pro'] },
    { value: 'deepseek', label: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
    { value: 'local', label: '本地模型', models: ['custom'] },
    { value: 'claude', label: 'Claude', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
    { value: 'gemini', label: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] }
  ];

  const handleSave = () => {
    // 这里可以添加保存配置的逻辑
    toast({
      title: "配置已保存",
      description: "模型配置已成功保存到系统中",
    });
  };

  const selectedProviderData = providers.find(p => p.value === selectedProvider);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
            PromptPerfect 模型配置
          </h1>
          <p className="text-muted-foreground">
            配置 AI 模型接口，支持本地和云端模型
          </p>
        </div>

        <Tabs defaultValue="provider" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="provider">模型提供商</TabsTrigger>
            <TabsTrigger value="advanced">高级设置</TabsTrigger>
            <TabsTrigger value="test">测试连接</TabsTrigger>
          </TabsList>

          <TabsContent value="provider" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>选择模型提供商</CardTitle>
                <CardDescription>
                  选择您要使用的 AI 模型提供商和具体模型
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="provider">提供商</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择提供商" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full gap-2">
                  <Label htmlFor="model">模型</Label>
                  <Select value={modelName} onValueChange={setModelName}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择模型" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProviderData?.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full gap-2">
                  <Label htmlFor="apikey">API 密钥</Label>
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="请输入 API 密钥"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                {(selectedProvider === 'local' || selectedProvider === 'custom') && (
                  <div className="grid w-full gap-2">
                    <Label htmlFor="baseurl">API 基础地址</Label>
                    <Input
                      id="baseurl"
                      placeholder="http://localhost:11434/v1"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={enabled}
                    onCheckedChange={setEnabled}
                  />
                  <Label htmlFor="enabled">启用此配置</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>高级参数设置</CardTitle>
                <CardDescription>
                  调整模型的行为参数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="maxtokens">最大Token数</Label>
                  <Input
                    id="maxtokens"
                    type="number"
                    placeholder="4096"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                  />
                </div>

                <div className="grid w-full gap-2">
                  <Label htmlFor="temperature">温度 (0-2)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    placeholder="0.7"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    较低的值使输出更确定，较高的值使输出更随机
                  </p>
                </div>

                <div className="grid w-full gap-2">
                  <Label htmlFor="systemprompt">系统提示词</Label>
                  <Textarea
                    id="systemprompt"
                    placeholder="您是一个有用的AI助手..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>测试模型连接</CardTitle>
                <CardDescription>
                  发送测试请求验证配置是否正确
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="testprompt">测试提示词</Label>
                  <Textarea
                    id="testprompt"
                    placeholder="请说'Hello World'"
                    defaultValue="请说'Hello World'"
                  />
                </div>

                <Button className="w-full">
                  发送测试请求
                </Button>

                <div className="border rounded-lg p-4 bg-muted">
                  <Label>响应结果</Label>
                  <div className="mt-2 text-sm">
                    测试响应将显示在这里...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            重置配置
          </Button>
          <Button onClick={handleSave}>
            保存配置
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ModelConfig;