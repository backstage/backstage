import{j as t,m as d,I as u,b as h,T as g}from"./iframe-C4dPZ8kl.js";import{r as x}from"./plugin-CGA0-Gio.js";import{S as m,u as n,a as S}from"./useSearchModal-l7ym1QG9.js";import{B as c}from"./Button-Bagr9kg6.js";import{a as f,b as M,c as j}from"./DialogTitle-B_WNMW88.js";import{B as C}from"./Box-COTlPoNf.js";import{S as r}from"./Grid-CZkThu2A.js";import{S as y}from"./SearchType-DI5FHsLZ.js";import{L as I}from"./List-CsFCwjIb.js";import{H as R}from"./DefaultResultListItem-Da5Fta3i.js";import{s as B,M as D}from"./api-CEECTQzO.js";import{S as T}from"./SearchContext-B8Up75jW.js";import{w as k}from"./appWrappers-7vg0hiAv.js";import{SearchBar as v}from"./SearchBar-6QRYwN2Z.js";import{a as b}from"./SearchResult-CgX9JNMr.js";import"./preload-helper-D9Z9MdNV.js";import"./index-pWMmScx5.js";import"./Plugin-CK7oqw3K.js";import"./componentData-DMZccOUa.js";import"./useAnalytics-DSRHfRk8.js";import"./useApp-DcP6b98f.js";import"./useRouteRef-BQcipW1o.js";import"./index-D_dzg66M.js";import"./ArrowForward-nOblFUSu.js";import"./translation-Jsw763Yj.js";import"./Page-DoTCwu2o.js";import"./useMediaQuery-Dhiz4raN.js";import"./Divider-BRNaSJ60.js";import"./ArrowBackIos-WJ5fyH7c.js";import"./ArrowForwardIos-CMqkYKzN.js";import"./translation-CK1L8KO2.js";import"./Modal-Ch6lvVax.js";import"./Portal-C3KrmcYH.js";import"./Backdrop-CYIUSPea.js";import"./styled-ie_8oXYP.js";import"./ExpandMore-DDjBqXKI.js";import"./useAsync-DoJxcUlb.js";import"./useMountedState-Cn7zfAE-.js";import"./AccordionDetails-Ce7Lmoz_.js";import"./index-DnL3XN75.js";import"./Collapse-CJN8yhuQ.js";import"./ListItem-Bx6LKxKb.js";import"./ListContext-CZ3AIdLK.js";import"./ListItemIcon-CYHp3Lm4.js";import"./ListItemText-BtakqwiJ.js";import"./Tabs-uUFByVet.js";import"./KeyboardArrowRight-D0ZVJtER.js";import"./FormLabel-Bar7Y58t.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DvYJkUVt.js";import"./InputLabel-ChDn_NUO.js";import"./Select-BOsKy5sc.js";import"./Popover-Df7jUf51.js";import"./MenuItem-BAffiuvQ.js";import"./Checkbox-w2lt6xr1.js";import"./SwitchBase-NNbXJhN0.js";import"./Chip-DaXXl-jO.js";import"./Link-qsu39Qum.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-ucvHRIwK.js";import"./useIsomorphicLayoutEffect-DxvvdXSg.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BpTsW9cu.js";import"./useDebounce-tF2RF71P.js";import"./InputAdornment-DdXdLxOI.js";import"./TextField-BHctqG4m.js";import"./useElementFilter-mjxhcd2C.js";import"./EmptyState-BxpOoaDa.js";import"./Progress-DorQaiBD.js";import"./LinearProgress-C19pYEed.js";import"./ResponseErrorPanel-CrprKTQq.js";import"./ErrorPanel-f98hRRjB.js";import"./WarningPanel-UrVVQWJv.js";import"./MarkdownContent-DRc5DkYJ.js";import"./CodeSnippet-B1XiwaHz.js";import"./CopyTextButton-ENp4DaQL.js";import"./useCopyToClipboard-CFD3RXQw.js";import"./Tooltip-BFnVM2Xk.js";import"./Popper-0_gUpV4D.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
