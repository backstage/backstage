import{j as o}from"./iframe-CMoZkI_V.js";import{c as e}from"./plugin-Bm43qfKP.js";import{S as l}from"./Grid-Cc5u-Kft.js";import{C as m}from"./ComponentAccordion-CoYmnyqG.js";import{w as a}from"./appWrappers-CwLdvgVt.js";import{T as i}from"./TemplateBackstageLogoIcon-BawNpM9X.js";import{I as s}from"./InfoCard-B7VpOy60.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Cw-agZnT.js";import"./componentData-C1GpKGWH.js";import"./useAnalytics-aVKC-y-x.js";import"./useApp-Cq0FwDqI.js";import"./useRouteRef-BKopQGJE.js";import"./index-Dl6v8jff.js";import"./DialogTitle-D9NQ_O8G.js";import"./Modal-JpNI_f-q.js";import"./Portal-BsEe4NVr.js";import"./Backdrop-t6uNU6s-.js";import"./Button-CMlJ_q4q.js";import"./useObservable-f8TZQGuk.js";import"./useIsomorphicLayoutEffect-DTydLypZ.js";import"./ExpandMore-RbVyUBOe.js";import"./AccordionDetails-BpZtQ7qf.js";import"./index-B9sM2jn7.js";import"./Collapse-CttgXTbY.js";import"./useAsync-nuZztPgy.js";import"./useMountedState-DXAXWcHb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DxGlUsBp.js";import"./ErrorBoundary-p7Vx4hun.js";import"./ErrorPanel-4fnCiNRY.js";import"./WarningPanel-CrW_vej9.js";import"./MarkdownContent-BAnHPybQ.js";import"./CodeSnippet-CC5elSQb.js";import"./Box-DDWlRNcc.js";import"./styled-BPnpuM9w.js";import"./CopyTextButton-D_szYgc0.js";import"./useCopyToClipboard-LW0UmRxQ.js";import"./Tooltip-DqsRLJKa.js";import"./Popper-p2DZK6W8.js";import"./List-mLBkoS87.js";import"./ListContext-DCW7FG4X.js";import"./ListItem-DQ5raIpn.js";import"./ListItemText-CMPMNvTt.js";import"./LinkButton-Br-4b2Az.js";import"./Link-_YMea8vG.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CDcSzNkn.js";import"./Divider-DAPmlDv6.js";import"./CardActions-DJqB9_Ii.js";import"./BottomLink-Cy-SqU1H.js";import"./ArrowForward-CYQeWInn.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
