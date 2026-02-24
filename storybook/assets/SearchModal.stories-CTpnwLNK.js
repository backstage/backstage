import{j as t,W as u,K as p,X as g}from"./iframe-n0fImp44.js";import{r as h}from"./plugin-DtGEKBMQ.js";import{S as l,u as c,a as x}from"./useSearchModal-CCnRMSld.js";import{s as S,M}from"./api-BSllHYH-.js";import{S as C}from"./SearchContext-B6K2-AbH.js";import{B as m}from"./Button-CvgGVM_K.js";import{m as f}from"./makeStyles-7xRdzCom.js";import{D as j,a as y,b as B}from"./DialogTitle-DWo-3_1L.js";import{B as D}from"./Box-BHviuYFv.js";import{S as n}from"./Grid-XRj5X-dC.js";import{S as I}from"./SearchType-D2ceMIu4.js";import{L as G}from"./List-B1pnwKZO.js";import{H as R}from"./DefaultResultListItem-_MC_95wM.js";import{w as k}from"./appWrappers-Zn1Dzz5V.js";import{SearchBar as v}from"./SearchBar-Bmp1rvGj.js";import{S as T}from"./SearchResult-6yP8NYqZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DIhOmsj8.js";import"./Plugin-CqdRJVr5.js";import"./componentData-CRFypemT.js";import"./useAnalytics-Z90ozCE5.js";import"./useApp-8qQHYFVi.js";import"./useRouteRef-PRRq5pIQ.js";import"./index-DIbljhmp.js";import"./ArrowForward-Cu-NEtTe.js";import"./translation-3YXmDr_q.js";import"./Page-Dj5CNZ2p.js";import"./useMediaQuery-fckud5iW.js";import"./Divider-DOkAKXLi.js";import"./ArrowBackIos-B7vgQEmS.js";import"./ArrowForwardIos-DdkRn3F0.js";import"./translation-DCc4tQWw.js";import"./lodash-W9bRznJ2.js";import"./useAsync-BaYKehuj.js";import"./useMountedState-2Tq8J5yq.js";import"./Modal-BKH7lGiL.js";import"./Portal-DaF9Kh8d.js";import"./Backdrop-DqmMtvx0.js";import"./styled-DPQIJJsa.js";import"./ExpandMore-CUT2VH4k.js";import"./AccordionDetails-q931FNIT.js";import"./index-B9sM2jn7.js";import"./Collapse-Ch2A_JUk.js";import"./ListItem-DO8hDZSO.js";import"./ListContext-BL95jnEy.js";import"./ListItemIcon-CRoJe4kL.js";import"./ListItemText-Dmum6zvX.js";import"./Tabs-BwCJEo2Q.js";import"./KeyboardArrowRight-DGYMZDaC.js";import"./FormLabel-Dg5xWOWF.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-X2sPpEO-.js";import"./InputLabel-CQAfhFwr.js";import"./Select-B9EAlykS.js";import"./Popover-CxSL2zjC.js";import"./MenuItem-D9lIP0fb.js";import"./Checkbox-w0FYkVAe.js";import"./SwitchBase-B8XDzYCF.js";import"./Chip-YuQzZBhr.js";import"./Link-DvnU995K.js";import"./index-DX3gz7st.js";import"./useObservable-CVilGQrk.js";import"./useIsomorphicLayoutEffect-Dw9zUxRi.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BwgABF7c.js";import"./useDebounce-BeMcBey_.js";import"./InputAdornment-D8JAgJ6_.js";import"./TextField-BvYJTarc.js";import"./useElementFilter-DOFVISIQ.js";import"./EmptyState-uF5c3mIj.js";import"./Progress-DPRl_Nmu.js";import"./LinearProgress-vYd-a_jp.js";import"./ResponseErrorPanel--2JrGQiV.js";import"./ErrorPanel-7b4Q_5Jm.js";import"./WarningPanel-7-PmPQUU.js";import"./MarkdownContent-CyNLuAt5.js";import"./CodeSnippet-pQTV2hZK.js";import"./CopyTextButton-DU4Ci22-.js";import"./useCopyToClipboard-DNTW5IKl.js";import"./Tooltip-Ni_hV5_d.js";import"./Popper-D6PulSAE.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
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
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
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
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
