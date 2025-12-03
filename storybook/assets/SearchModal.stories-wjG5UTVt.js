import{j as t,m as d,I as u,b as h,T as g}from"./iframe-C9zrakkc.js";import{r as x}from"./plugin-BRJcO3GI.js";import{S as m,u as n,a as S}from"./useSearchModal-g1OIf7TH.js";import{B as c}from"./Button-CmMZjW_f.js";import{a as f,b as M,c as j}from"./DialogTitle-Bu0pvr4n.js";import{B as C}from"./Box-C1t3nISm.js";import{S as r}from"./Grid-JwSod7uj.js";import{S as y}from"./SearchType-BKI5WoD8.js";import{L as I}from"./List-Dykhft8E.js";import{H as R}from"./DefaultResultListItem-BQPIaq4D.js";import{s as B,M as D}from"./api-ADZ3AgWv.js";import{S as T}from"./SearchContext-C0ChnN0X.js";import{w as k}from"./appWrappers-D30AEFfJ.js";import{SearchBar as v}from"./SearchBar-DEdguy2T.js";import{a as b}from"./SearchResult-C5xtpRBD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CjAyISCC.js";import"./Plugin-DYqBkcEW.js";import"./componentData-CTZUzyGA.js";import"./useAnalytics-DAZilNqi.js";import"./useApp-5u7uhQnf.js";import"./useRouteRef-u0DWcSPD.js";import"./index-kZEKiPjo.js";import"./ArrowForward-B_STm-OI.js";import"./translation-U8ZgGJTK.js";import"./Page-xg1vkiyR.js";import"./useMediaQuery-BK3120Kc.js";import"./Divider-BvnOZNSI.js";import"./ArrowBackIos-8QRhV0J3.js";import"./ArrowForwardIos-DePqt_QP.js";import"./translation-Cs3MKfXN.js";import"./Modal-BI7VDIZ7.js";import"./Portal-CYobuNZx.js";import"./Backdrop-CAN_1fph.js";import"./styled-q2Tapbp0.js";import"./ExpandMore-BmhSC8QK.js";import"./useAsync-ClKr9TyR.js";import"./useMountedState-C5AiKHab.js";import"./AccordionDetails-CO835Xyy.js";import"./index-B9sM2jn7.js";import"./Collapse-BSaPuFEG.js";import"./ListItem-DN7mBFNT.js";import"./ListContext-D4YzdYeM.js";import"./ListItemIcon-BN7Nr2w-.js";import"./ListItemText-u9zyj5b2.js";import"./Tabs-Cpd6_eeD.js";import"./KeyboardArrowRight-dhuBQv-6.js";import"./FormLabel-KYyo1YaL.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C-RjzHBz.js";import"./InputLabel-BZzk3L7N.js";import"./Select-BbWiZwSi.js";import"./Popover-DNks6xHK.js";import"./MenuItem-gfVzx_r1.js";import"./Checkbox-Dwz9kxDq.js";import"./SwitchBase-B3wrQpA3.js";import"./Chip-Bg6VTpFe.js";import"./Link-C1eBfv8e.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-DNrCFxZS.js";import"./useIsomorphicLayoutEffect-BN5wUfcv.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-7IVleeeJ.js";import"./useDebounce-BEOyQIh7.js";import"./InputAdornment-C71GKniK.js";import"./TextField-BhlizQZW.js";import"./useElementFilter-DRQvtUH7.js";import"./EmptyState-PZuvPZ85.js";import"./Progress-BDzvqsPx.js";import"./LinearProgress-Cebcaf6E.js";import"./ResponseErrorPanel-BXX3ExC5.js";import"./ErrorPanel-C1y9p2wT.js";import"./WarningPanel-BpsyaNdk.js";import"./MarkdownContent-DnFMmDme.js";import"./CodeSnippet-DR38SpuH.js";import"./CopyTextButton-ClvHCzDa.js";import"./useCopyToClipboard-hqcagNht.js";import"./Tooltip-CwwM6KlC.js";import"./Popper-CnoPmosF.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
