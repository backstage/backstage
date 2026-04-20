import{j as t,S as d,a0 as u,$ as h}from"./iframe-Cz6SWQVH.js";import{r as g}from"./plugin-BGO2zvuJ.js";import{S as m,u as n,a as x}from"./useSearchModal-DBJQz8aj.js";import{B as c}from"./Button-BNliiCLH.js";import{D as S,a as f,b as M}from"./DialogTitle-6kWTyOql.js";import{B as j}from"./Box-BfOwOGWn.js";import{S as r}from"./Grid-vJ4N4mtA.js";import{S as C}from"./SearchType-D9mdxPSB.js";import{L as y}from"./List-CPTtSvEh.js";import{H as I}from"./DefaultResultListItem-Bs2M9GaA.js";import{w as R}from"./appWrappers-CGd2p7y5.js";import{m as B}from"./makeStyles-DkpM-pcx.js";import{s as D,M as k}from"./api-BwTE7cWZ.js";import{S as v}from"./SearchContext-3CcKjcM0.js";import{SearchBar as T}from"./SearchBar-Bg9c-LZR.js";import{S as b}from"./SearchResult-DXHQsfnB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B4nD_wz4.js";import"./Plugin-CyLVl4zx.js";import"./componentData-57EBWxRo.js";import"./useAnalytics-D119RZa6.js";import"./useApp-DGYXI2Z1.js";import"./useRouteRef-BkQ0CrV6.js";import"./ArrowForward-DZa_Hyhb.js";import"./translation-BjXqW7er.js";import"./Page-LaAhjTtb.js";import"./useMediaQuery-CeQPnuqh.js";import"./Divider-BnJfzwCx.js";import"./ArrowBackIos-Bqid_Hk3.js";import"./ArrowForwardIos-B61VnrQQ.js";import"./translation--wE18V_e.js";import"./Modal-CRoJIq51.js";import"./Portal-Cwv6n3co.js";import"./Backdrop-BNPmGt4T.js";import"./styled-CHQDB4JG.js";import"./ExpandMore-VjMAX4xv.js";import"./useAsync-DBMJljw9.js";import"./useMountedState-BtaJiN7o.js";import"./AccordionDetails-CGZDKfZJ.js";import"./index-B9sM2jn7.js";import"./Collapse-Bcgk9z9C.js";import"./ListItem-Co51ld_D.js";import"./ListContext-BZcjIfXN.js";import"./ListItemIcon-IclZHLVb.js";import"./ListItemText-BXEA_G4I.js";import"./Tabs-C4FxLYMg.js";import"./KeyboardArrowRight-BzVk1t35.js";import"./FormLabel-C0sepyRi.js";import"./formControlState-CnyRz5rd.js";import"./InputLabel-BTrcsB0a.js";import"./Select-BCG14GOZ.js";import"./Popover-CLTNTp2m.js";import"./MenuItem-DRGiAVo4.js";import"./Checkbox-BNpdIv2N.js";import"./SwitchBase-COJRjyid.js";import"./Chip-C-4MhTGz.js";import"./Link-rJUKOl72.js";import"./index-COEqbYNs.js";import"./lodash-BYoV5fke.js";import"./WebStorage-D5wyQj1U.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CBnCpkjY.js";import"./useIsomorphicLayoutEffect-DrKO9cb5.js";import"./BUIProvider-C-bV_KZY.js";import"./openLink-yrE7vS55.js";import"./Search-C4YA_10c.js";import"./useDebounce-BjSpQquf.js";import"./InputAdornment-BA90BNNH.js";import"./TextField-C4xO3bWp.js";import"./useElementFilter-CqZw6aqA.js";import"./EmptyState-A6TkpLU0.js";import"./Progress-DVE4sspz.js";import"./LinearProgress-VtLyBSBK.js";import"./ResponseErrorPanel-Ch-44wPt.js";import"./ErrorPanel-ZEv74Hg9.js";import"./WarningPanel-pLOCmyda.js";import"./MarkdownContent-D0APngxN.js";import"./CodeSnippet-DUPJVwqL.js";import"./CopyTextButton-3tmDfE_W.js";import"./useCopyToClipboard-BcEFygxy.js";import"./Tooltip-DEuFBR78.js";import"./Popper-CWL0dBRv.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
