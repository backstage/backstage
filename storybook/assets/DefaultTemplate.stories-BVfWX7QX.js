import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-q37i5wh7.js";import{s as g,H as u}from"./plugin-i1h9CgYk.js";import{c as h}from"./api-DIxxI1AL.js";import{c as f}from"./catalogApiMock-DLQg8ULs.js";import{s as x}from"./api-BxIuVTwn.js";import{S as y}from"./SearchContext-D24n4Ehu.js";import{P as S}from"./Page-BhjIEovd.js";import{S as r}from"./Grid-C05v6eeb.js";import{b as k,a as j,c as C}from"./plugin-t88-RfOu.js";import{T as P}from"./TemplateBackstageLogo-BxoY5tAX.js";import{T as I}from"./TemplateBackstageLogoIcon-BJTTBZdf.js";import{e as T}from"./routes-C2SD2-GK.js";import{w as v}from"./appWrappers-COl_vAr6.js";import{s as G}from"./StarredEntitiesApi-DuxK7dcK.js";import{M as A}from"./MockStarredEntitiesApi-CZWfwXPI.js";import{I as B}from"./InfoCard-Cd6HgPXU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CyHPEJ-Q.js";import"./Plugin-CB9fW_xb.js";import"./componentData-E9OYffVp.js";import"./useAnalytics-Qh0Z6cDc.js";import"./useApp-DRQlf20V.js";import"./useRouteRef-Dm0QmNOs.js";import"./index-4QSZcc7K.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-5U-iBZk2.js";import"./useMountedState-rIY5swUn.js";import"./DialogTitle-CtRkS27u.js";import"./Modal-TMOxKW-w.js";import"./Portal-Cg2yUny5.js";import"./Backdrop-CWK59iWf.js";import"./Button-DPiRNZXm.js";import"./useObservable-e6xV4JA9.js";import"./useIsomorphicLayoutEffect-BOIrCsYn.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CMtJW6TZ.js";import"./ErrorBoundary-DCLXQR6g.js";import"./ErrorPanel-F1yEZWbU.js";import"./WarningPanel-C_8iIf0P.js";import"./ExpandMore-Dh8PJJ4O.js";import"./AccordionDetails-SWAG835D.js";import"./index-B9sM2jn7.js";import"./Collapse-EBwNTQD_.js";import"./MarkdownContent-Cy41HZJg.js";import"./CodeSnippet-CLlJVEMw.js";import"./Box-COPOq1Uf.js";import"./styled-Cr1yRHHC.js";import"./CopyTextButton-D-U2fpdK.js";import"./useCopyToClipboard-DKocU9ZU.js";import"./Tooltip-1ydGyrcT.js";import"./Popper-KbPRvRer.js";import"./List-PIZxoj_p.js";import"./ListContext-CjbrLwST.js";import"./ListItem-CpM31wZi.js";import"./ListItemText-DrEGNqUi.js";import"./LinkButton-BWyYwHDi.js";import"./Link-VlZlHdCt.js";import"./CardHeader-DxnZ9i-M.js";import"./Divider-DMqMfewh.js";import"./CardActions-CCEsNnC3.js";import"./BottomLink-BO513QD8.js";import"./ArrowForward-Bjdstcjo.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
