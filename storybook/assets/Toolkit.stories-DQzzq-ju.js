import{j as o}from"./iframe-Bnzrr9GJ.js";import{c as e}from"./plugin-DML38mmW.js";import{S as l}from"./Grid-yfENroGK.js";import{C as m}from"./ComponentAccordion-BOsLeaNX.js";import{w as a}from"./appWrappers-VyQoo8wK.js";import{T as i}from"./TemplateBackstageLogoIcon-D9-Dmhim.js";import{I as s}from"./InfoCard-B2jLnxg1.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D_YG91mq.js";import"./componentData-q9jR-RmB.js";import"./useAnalytics-0uTDec9U.js";import"./useApp-SixTcc6z.js";import"./useRouteRef-BIDrbivK.js";import"./index-CYC8aWCi.js";import"./DialogTitle-B57sbJyb.js";import"./Modal-C9035a_p.js";import"./Portal-7sPWK5aa.js";import"./Backdrop-U11n_nYY.js";import"./Button-C4wuUHK5.js";import"./useObservable-DuLbtCIZ.js";import"./useIsomorphicLayoutEffect-BBA0B-Gu.js";import"./ExpandMore-lB9NR-kr.js";import"./AccordionDetails-CuEuFzda.js";import"./index-B9sM2jn7.js";import"./Collapse-Bk6-UMMi.js";import"./useAsync-Cf2YmW8g.js";import"./useMountedState-BCp4s1hj.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CQJGZ3r6.js";import"./ErrorBoundary-DFuYykN9.js";import"./ErrorPanel-CD5X405H.js";import"./WarningPanel-CiGAMcSc.js";import"./MarkdownContent-uyUP_FU2.js";import"./CodeSnippet-CNEmId6n.js";import"./Box-_ldnD672.js";import"./styled-ECwvL4gF.js";import"./CopyTextButton-h_AlfJlB.js";import"./useCopyToClipboard-C1DHvlyv.js";import"./Tooltip-BNoXxCwH.js";import"./Popper-xM2ICnpy.js";import"./List-C5zGpaSP.js";import"./ListContext-BS9Mebja.js";import"./ListItem-WNmrdDGe.js";import"./ListItemText-CaCse6tD.js";import"./LinkButton-C4SkPNpD.js";import"./Link-B2CkVKPO.js";import"./lodash-Czox7iJy.js";import"./CardHeader-D0WzuIfd.js";import"./Divider-Dygs3iK7.js";import"./CardActions-BwdKTwvs.js";import"./BottomLink-BBfeMbVs.js";import"./ArrowForward-KRJIM6Q4.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
