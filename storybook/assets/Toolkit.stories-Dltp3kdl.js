import{j as o}from"./iframe-Hw755TNi.js";import{c as e}from"./plugin-BL2Fs7YY.js";import{S as l}from"./Grid-w98sXAXk.js";import{C as m}from"./ComponentAccordion-D7uq3WPY.js";import{w as a}from"./appWrappers-D03uvxZe.js";import{T as i}from"./TemplateBackstageLogoIcon-CuxCzxcI.js";import{I as s}from"./InfoCard-kqX3XXCw.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BMqfvgOd.js";import"./componentData-BOwbR1Jz.js";import"./useAnalytics-CLuGYyUh.js";import"./useApp-DdUuBagy.js";import"./useRouteRef-BmYWNidK.js";import"./index-CMiNgydu.js";import"./DialogTitle-DJbOyMxK.js";import"./Modal-DYeoU8Cn.js";import"./Portal-BZ6RZj06.js";import"./Backdrop-0thaD7uc.js";import"./Button-CpMmzG9U.js";import"./useObservable-Bntv1Tee.js";import"./useIsomorphicLayoutEffect-VemboVK5.js";import"./ExpandMore-CG9kYvvb.js";import"./AccordionDetails-6Uenh_Cj.js";import"./index-B9sM2jn7.js";import"./Collapse-Cpllhes9.js";import"./useAsync-DhB8gEfG.js";import"./useMountedState-DdJ7HSpX.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CYUX33L8.js";import"./ErrorBoundary-C546sKxy.js";import"./ErrorPanel-CQgjrtaw.js";import"./WarningPanel-BGdCoFxI.js";import"./MarkdownContent-C43gFO83.js";import"./CodeSnippet-8GoXIwx4.js";import"./Box-DcpjYi3J.js";import"./styled-qTtGNmm_.js";import"./CopyTextButton-8-jfuG_8.js";import"./useCopyToClipboard-DQJZpUYG.js";import"./Tooltip-BwBST4sz.js";import"./Popper-QpCwrVnW.js";import"./List-Z-bLSsG8.js";import"./ListContext-moCHcqFh.js";import"./ListItem-DwV3XkH8.js";import"./ListItemText-f-UryDTW.js";import"./LinkButton-CXrJu3G0.js";import"./Link-BYu3CTsd.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-DYcL2J26.js";import"./Divider-BkC6drLy.js";import"./CardActions-_4wK1Jvd.js";import"./BottomLink-D76zrCEq.js";import"./ArrowForward-BgApEUXb.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
