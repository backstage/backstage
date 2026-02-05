import{j as o}from"./iframe-M9O-K8SB.js";import{c as e}from"./plugin-CYmgpVyh.js";import{S as l}from"./Grid-DxciBpqo.js";import{C as m}from"./ComponentAccordion-Tk8Zz9OI.js";import{w as a}from"./appWrappers-k5-JRCH3.js";import{T as i}from"./TemplateBackstageLogoIcon-D4QF7o4m.js";import{I as s}from"./InfoCard-DsauPiav.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CnPMefJ2.js";import"./componentData-lwFigNXQ.js";import"./useAnalytics-8ya555GT.js";import"./useApp-Citse85p.js";import"./useRouteRef-BuU8-jzQ.js";import"./index-CuiKZooy.js";import"./DialogTitle-BJV9GWqg.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./Backdrop-D_SJu6io.js";import"./Button-JPiqA3bT.js";import"./useObservable-CuDF8Tct.js";import"./useIsomorphicLayoutEffect-9yTSWmeM.js";import"./ExpandMore-BQg6NhWn.js";import"./AccordionDetails-C-b5rZIs.js";import"./index-B9sM2jn7.js";import"./Collapse-yN0IR1ZS.js";import"./useAsync-CFnaQwpM.js";import"./useMountedState-CLl1ZXx0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CW06YTYP.js";import"./ErrorBoundary-DxLHiv0j.js";import"./ErrorPanel-DmuSnSG8.js";import"./WarningPanel-BNg1npDI.js";import"./MarkdownContent-CYUmriLW.js";import"./CodeSnippet-BQZTwjqk.js";import"./Box-DrVgjJoD.js";import"./styled-Ddkk_tuK.js";import"./CopyTextButton-D94RjEoK.js";import"./useCopyToClipboard-BSGGLx0n.js";import"./Tooltip-Bg-nqDOZ.js";import"./Popper-BxqJldSX.js";import"./List-DFXlWgcm.js";import"./ListContext-CQy2fJuy.js";import"./ListItem-CccU-wMK.js";import"./ListItemText-OpvVVx-v.js";import"./LinkButton-71uZgpqj.js";import"./Link-Btc0GL0z.js";import"./lodash-Czox7iJy.js";import"./CardHeader-PYk2WpzE.js";import"./Divider-O5bh-cJ-.js";import"./CardActions-DH8NqYkM.js";import"./BottomLink-BsHjsdIF.js";import"./ArrowForward-DAkk1QjY.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
