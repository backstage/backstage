import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-C9zrakkc.js";import{s as g,H as u}from"./plugin-BRJcO3GI.js";import{c as h}from"./api-DOeM-2MH.js";import{c as f}from"./catalogApiMock-BwExXJqt.js";import{s as x}from"./api-ADZ3AgWv.js";import{S as y}from"./SearchContext-C0ChnN0X.js";import{P as S}from"./Page-sRCQHiJB.js";import{S as r}from"./Grid-JwSod7uj.js";import{b as k,a as j,c as C}from"./plugin-FvNGz4xC.js";import{T as P}from"./TemplateBackstageLogo-C4zRhTg2.js";import{T}from"./TemplateBackstageLogoIcon-Ch0wtquG.js";import{e as I}from"./routes-m1hxvVLe.js";import{w as v}from"./appWrappers-D30AEFfJ.js";import{s as G}from"./StarredEntitiesApi-B3XHKtsK.js";import{M as A}from"./MockStarredEntitiesApi-E5eh3ea9.js";import{I as B}from"./InfoCard-RbAMJy0N.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CjAyISCC.js";import"./Plugin-DYqBkcEW.js";import"./componentData-CTZUzyGA.js";import"./useAnalytics-DAZilNqi.js";import"./useApp-5u7uhQnf.js";import"./useRouteRef-u0DWcSPD.js";import"./index-kZEKiPjo.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-ClKr9TyR.js";import"./useMountedState-C5AiKHab.js";import"./DialogTitle-Bu0pvr4n.js";import"./Modal-BI7VDIZ7.js";import"./Portal-CYobuNZx.js";import"./Backdrop-CAN_1fph.js";import"./Button-CmMZjW_f.js";import"./useObservable-DNrCFxZS.js";import"./useIsomorphicLayoutEffect-BN5wUfcv.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-o9HZeIUg.js";import"./ErrorBoundary-DT6g9ILI.js";import"./ErrorPanel-C1y9p2wT.js";import"./WarningPanel-BpsyaNdk.js";import"./ExpandMore-BmhSC8QK.js";import"./AccordionDetails-CO835Xyy.js";import"./index-B9sM2jn7.js";import"./Collapse-BSaPuFEG.js";import"./MarkdownContent-DnFMmDme.js";import"./CodeSnippet-DR38SpuH.js";import"./Box-C1t3nISm.js";import"./styled-q2Tapbp0.js";import"./CopyTextButton-ClvHCzDa.js";import"./useCopyToClipboard-hqcagNht.js";import"./Tooltip-CwwM6KlC.js";import"./Popper-CnoPmosF.js";import"./List-Dykhft8E.js";import"./ListContext-D4YzdYeM.js";import"./ListItem-DN7mBFNT.js";import"./ListItemText-u9zyj5b2.js";import"./LinkButton-C-LjwduR.js";import"./Link-C1eBfv8e.js";import"./CardHeader-BJEjS_-7.js";import"./Divider-BvnOZNSI.js";import"./CardActions-C42Lpz0g.js";import"./BottomLink-CXlh_zpn.js";import"./ArrowForward-B_STm-OI.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
