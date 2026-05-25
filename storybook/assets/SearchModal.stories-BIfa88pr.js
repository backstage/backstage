import{j as t,W as d,a3 as u,a2 as h}from"./iframe-C23uhf86.js";import{r as g}from"./plugin-BSxYqmnf.js";import{S as l,u as n,a as x}from"./useSearchModal-SWNCusMf.js";import{B as c}from"./Button-HPy8a3K8.js";import{D as S,a as f,b as M}from"./DialogTitle-Cd6-RmlE.js";import{B as j}from"./Box-WThUmTfz.js";import{S as r}from"./Grid-B2cP74K4.js";import{S as C}from"./SearchType-Bk8NPqkl.js";import{L as y}from"./List-CxEdUBo1.js";import{H as I}from"./DefaultResultListItem-nIPKabOE.js";import{w as R}from"./appWrappers-BzBfgp50.js";import{m as B}from"./makeStyles-CpHXwfxK.js";import{s as D,M as k}from"./api-aSJcWrTc.js";import{S as v}from"./SearchContext-Lc5uPF0c.js";import{SearchBar as T}from"./SearchBar-CyllgqJo.js";import{S as b}from"./SearchResult-CZ2u_Wt-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CRGK4bah.js";import"./Plugin-CLtNy0WY.js";import"./componentData-BZ6And4s.js";import"./useAnalytics-cDq5hBLc.js";import"./useApp-BqO9fDba.js";import"./useRouteRef-BZu42zxv.js";import"./ArrowForward-BQHHH4N9.js";import"./translation-CSYAF5EO.js";import"./Page-UXXJxqks.js";import"./useMediaQuery-CvIShWpx.js";import"./Divider-CzSewKKo.js";import"./ArrowBackIos-vkEg5UoL.js";import"./ArrowForwardIos-DQMq3lHN.js";import"./translation-BR7YyGUp.js";import"./Modal-Dut4J2Kn.js";import"./Portal-D5gzgC6z.js";import"./Backdrop-CMxzScca.js";import"./styled-CWwxa9HM.js";import"./ExpandMore-BXQET-BH.js";import"./useAsync-xdfTfIaZ.js";import"./useMountedState-CgrANCz4.js";import"./AccordionDetails-Fqpb5Vms.js";import"./index-B9sM2jn7.js";import"./Collapse-Yf2O74V0.js";import"./ListItem-D9IookCZ.js";import"./ListContext-Dp4qNsSt.js";import"./ListItemIcon-CPV8s5Dq.js";import"./ListItemText-qN0jgnKe.js";import"./Tabs-GVNASjmU.js";import"./KeyboardArrowRight-zcdCMv15.js";import"./FormLabel-CCb_RAXb.js";import"./formControlState-BH6VChQp.js";import"./InputLabel-B7YC04CG.js";import"./Select-C0mIcBan.js";import"./Popover-TY3wPQ66.js";import"./MenuItem-DErbDWyg.js";import"./Checkbox-BwdAVf1e.js";import"./SwitchBase-ByCqtRG5.js";import"./Chip-DNArXAr-.js";import"./Link-BTfSvZWa.js";import"./index-DzKqHxgJ.js";import"./lodash-DUhit4Jc.js";import"./WebStorage-9ssomDje.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CS6HreOO.js";import"./useIsomorphicLayoutEffect-Dbl_tdyq.js";import"./BUIProvider-CudKxgBg.js";import"./openLink-DxqMpht5.js";import"./useResolvedHref-K2vtdLDf.js";import"./Search-B8mqLirn.js";import"./useDebounce-BEYcRoba.js";import"./InputAdornment-DbPeOkQ9.js";import"./TextField-Qf4PT74G.js";import"./useElementFilter-BK_ImDBR.js";import"./EmptyState-C73jUIsM.js";import"./Progress-D-9uawGQ.js";import"./LinearProgress-B5kr522r.js";import"./ResponseErrorPanel-VpMg431Q.js";import"./ErrorPanel-CPQKlaov.js";import"./WarningPanel-HyhysqNj.js";import"./MarkdownContent-5Zn4ocUq.js";import"./CodeSnippet-ybNHpEg3.js";import"./CopyTextButton-Xk8JeqLJ.js";import"./useCopyToClipboard-O6QvUuVd.js";import"./Tooltip-CSFZreiO.js";import"./Popper-ByrnRm1o.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
